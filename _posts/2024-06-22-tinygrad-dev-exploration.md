---
title: tinygrad dev exploration
date: 2024-06-22T11:27:48+02:00
layout: post
usemathjax: False
updated: 2024-06-30T16:03:35+00:00
---

# tinygrad dev exploration

- [Direction](#Direction)
- [More refined](#More%20refined)
- [Less refined](#Less%20refined)
	- [tinycorp mission](#tinycorp%20mission)
	- [encountered python](#encountered%20python)
	- [creating a Tensor](#creating%20a%20Tensor)
		- [creating tensors with constructors](#creating%20tensors%20with%20constructors)

## Direction

read tensor.py
explore anything unfamiliar
condense any writing
create more abstract layers, current writing is one layer above code. should eventually connect all the way to the mission.

## More refined

## Less refined

### tinycorp mission

accelerate, commoditize the petaflop
improve soft-hardware interface for AI computesoftware first
funded by love and tinyboxes

factory -> soft (tinygrad), hard (tinybox, tinychip)
product -> compiled models

*tinygrad model --> friendly C --> standalone would be (is?) nice*

AI compute = tensors = multidimensional lists of floats

### encountered python

`__slots__` lists the expected class attributes for fast access and memory savings [more](https://stackoverflow.com/questions/472000/usage-of-slots)
`all()` is True of all arguments evaluate to True
`WeakValueDictionary` for accessing values that can be garbage collected like the reference isn't there
if there is an argument in a function definition like `*`

### creating a Tensor

in `tensor.py`

`Tensor(data, device=None, dtype=None, requires_grad=None)`

determine device for the Tensor using `Device.canonicalize()`
- eligible devices are those for which exists a `runtime/ops_{device}.py`
- if `device` is `None` and so cannot be canonicalized, it is set to the returned string from `Device.DEFAULT`
	- returns the device that is set to 1 as an environment variable
	- if it finds none `{device}Device.__init__({device})` is tried for `METAL`,`AMD`,`CUDA`, `GPU`, `CLANG`, `LLVM` in their respective `runtime/ops_{device}.py`
		- for each device: `Compiled.__init__(device, MallocAllocator or {device allocator}, {Device renderer}, {Device compiler}, {device runtime}, {device graph})`
	- the name of the first device this causes no problems with, is returned from `Device.DEFAULT` and set to 1 as an environment variable.

*TODO: if `DEBUG` > 1, a message is printed informing which device was initialized*

depending on type of data, sets data to return value of helper functions `_loadop()` or `_frompy`
Both return a `LazyBuffer` from calling:
`LazyBuffer.loadop(op, shape, dtype, device, arg=None, src=(), enable_cache=False)`
- `op` is either `LoadOps.EMPTY` or `LoadOps.CONST`, which are just numbers (0 and 1 respectively) from the LoadOps Enumerator in `ops.py`
- `shape` is `tuple()`or `(0,)` if `LoadOps.EMPTY` or the actual shape if the input was `tuple` or `list`
- `dtype`is always tinygrad.dtype, either given or determined from data
- `device` is what was determined above or `NPY` if the input is a list, tuple or ndarray and so is numpy. Since numpy is removed soon from tinygrad, I ingore this detail.
- `arg` is `data` passed to the Tensor
`LazyBuffer.loadop()` checks that src is a tuple and gets `ShapeTracker.from_shape(shape)`
- `ShapeTracker((View.create(shape),))` to give the ShapeTracker a View. Since no stride is defined, it will be created using the helper function `strides_for_shape(shape)`, then canonicalized. Then `View(shape, stride, offset=0, mask=None, contiguous=True)` with these default arguments
ShapeTracker is passed as an argument to the helper function `create_lazybuffer(device, ShapeTracker, dtype, op, arg, src, enable_cache)`
- if `op==LoadOps.EMPTY`, the `size` of the ShapeTracker will be 0 and `op`will turn to `LoadOps.CONST` and unless Tensor data was `Variable`.
- For reasons yet unknown, if `LoadOps.CONST`(guaranteed at this point, unless data was `Variable`), then the data (now in `arg`) runs through pythons native `int()`, `float()` or `bool()` functions depending on its dtype.
- if the `LazyBuffer` is already `lazycache` and `enable_cache` is True, use that one.
- else create one: `LazyBuffer(device, st, dtype, op, arg, srcs, base=base)` (`base` is `None`)
	- Creates a `Buffer(device, st.size, dtype)` with additional properties:
		- `self.options = None`
		- `self.offset = 0`
		- `self._base = None`
		- `self.lb_refcount = 1`
The created `LazyBuffer` is stored in `Tensor.lazydata` after making sure it is on the right device

#### creating tensors through methods

- Tensor.empty - no new ops
- Tensor.zeros - `full(shape, 0, ...)`
- Tensor.ones - `full(shape, 1, ...)`
- `full(shape, fill_value)`:
```python
Tensor(fill_value, **kwargs).reshape((1, )*len(new_shape := argfix(shape))).expand(new_shape)
```

- Tensor.arange - `full(shape, step, dtype, **kwargs)._cumsum() + (start - step)` -> `.cast(dtype)`
- Tensor.eye - `ones().pad().flatten().shrink().reshape()`
- Tensor.full_like - `full`
- Tensor.zeros_like `full_like`
- Tensor.ones_like `full_like`

all Tensor constructors that aren't random build on the `Tensor.full(shape, fill_value)` function, which first *reshapes* the Tensor with 1 element (fill_value) to the target number of dimensions.
`Tensor.reshape` calls `F.Reshape.apply(self, new_shape)` from `function.py`, which inherits from `class Function` in `tensor.py`.

all `Function` "children", in their `apply`function, create a new Tensor and populate it with new `lazydata`, `requires_grad`, `grad=None` and `_ctx` if `requires_grad` is True. `_ctx` contains the function that was called, which also contains the parent Tensors.

the `forward` method for `F.Reshape()` is called on the `lazydata`.
`lazydata.reshape` turns into `self._view(st.reshape())` (st = ShapeTracker) in `lazy.py`.
`ShapeTracker.reshape()` returns a new `ShapeTracker` with (by default) its latest `views` replaced by a new one with the new shape. if `MERGE_VIEWS=0`, the new view is appended to `views` instead.
In the current case, the previous View with shape `(1,)` is directly replaced by the new one `(1,)*len(new_shape)`.
finally, the tensor gets a new `LazyBuffer` from  `create_lazybuffer(self.device, new_st, self.dtype, base=self.base)`

after the reshape, the dimension use `Tensor.expand(new_shape)` to get the now correct number of dimensions to the final shape.
```python
self._broadcast_to(tuple(from_ if to == -1 or to is None else to for from_, to in zip(*(_pad_left(self.shape, argfix(shape, *args))))))
```
`argfix` ensures the function works even if the shape was not input as a tuple but through multiple arguments like `reshape(2,2,2)`.
`_pad_left` gets inputs to the same number of dimensions.
`*` unpacks the tuple with both shapes that `_pad_left` returns

`Tensor._broadcast_to(self, shape)` runs `_pad_left` again
runs `self.reshape` again to the "padded" shape
then `F.Expand.apply()` -> `lazybuffer.expand()` -> `shapetracker.expand()` -> `View.expand()` which producees  a new `View` with the new shape and everything else being equal. returns a new `ShapeTracker`, returns a new `LazyBuffer`, returns a new `Tensor`


Tensor.arange offers new stuff, calling `Tensor._cumsum()`, using Tensor-Int addition and casting the Tensor.
from `Tensor._cumsum()`:
```python
self.transpose(axis,-1).pad2d((pl_sz,-int(_first_zero)))._pool((self.shape[axis],)).sum(-1).transpose(axis,-1)
```
where `axis` is 0 and `pl_sz` will in this case be `self.shape[0] - 1`

`Tensor.transpose(0, -1)`, which translates to `Tensor.permute(order)` where in the order dim 0 and the last dim were swapped. `permute` resolves orders with negative dim indices, error checks and runs `F.Permute.apply(self, order=resolve_order)` -> `lazybuffer.permute(order)` -> `ShapeTracker.permute(order)` -> `View.permute(axis=order)` -> `View.create(permuted_shape, permuted_strides, permuted_mask(if applicable),...)`
returns a new `View`in a new `ShapeTracker` in a new `lazybuffer` in a new `Tensor`
this transpose changes nothing because the input was a 1D Tensor.

`Tensor.pad2d(self.shape[0] - 1, 0)` adds `self.shape[0] - 1` 0s to the left on the lowest dimension. Using `pad2d()` seems crazy here, it goes through `Tensor._slice()`, which eventually calls `Tensor.pad((self.shape[0] - 1, 0))` which is even crazier, which calls `F.Pad.apply(...)` which goes on the tour again.
`LazyBuffer.pad()` -> `ShapeTracker.pad()` -> `View.pad()`
where `(self.shape[0] - 1, 0)` turns into  `(-self.shape[0] - 1, self.shape)`, which was already calculated in `Tensor.pad2d` for some reason.
A mask is created: `((self.shape[0] - 1, self.shape[0] + self.shape[0] - 1))`
calling a trustworthy `View.__unsafe_resize(evernew_arg, new_mask)` where a new `View` is created with the extended `shape` (`self.shape[0] + self.shape[0] - 1`), `offset` of `-self.shape[0] - 1` and the `mask` as it was created. `contiguous` turns `False` whatever that means.

To see how mask, offset and maybe contiguous are interpreted, a detour to `Tensor.__getitem__()` follows. Or not, because `__getitem__` only returns more "metadata" and does not resolve it. So the detour extends to understanding how the Tensors are realized starting from `Tensor.tolist()`
To return to: rest of `Tensor.arange`, other Tensor construction methods and random construction methods:
- Tensor.manual_seed
- Tensor.rand
- Tensor.randn
- Tensor.randint
- Tensor.normal
- Tensor.uniform
- Tensor.scaled_uniform
- Tensor.glorot_uniform
- Tensor.kaiming_uniform
- Tensor.kaiming_normal

### Realizing Tensors

Starting from `Tensor([2,2,2]).pad(((2,0),)).tolist()`

`Tensor.tolist()` -> `Tensor.data().tolist()` -> `Tensor._data().cast(self.dtype.fmt, self.shape).tolist()`

`Tensor._data`
 - `Tensor.cast(self.dtype.scalar())` applies `F.Cast(dtype)`
 - `Tensor.contiguous()` applies `F.Contiguous()`
	 - `LazyBuffer.contigous()`
		 - `LazyBuffer.e(LoadOps.CONTIGUOUS)` in the current case
			 - makes sure dtypes and shapes(?) of all lazybuffers and their bases match
			 - "const folding"(?), which in the current case does nothing
			 - returns a new `LazyBuffer` with all sources (self and bases, in this case only self) in the `srcs` attribute
		- stores a reference and something in self.base.contiguous_child (?)
- `Tensor.to("CLANG")`
	- if it is not already on CLANG, it makes a new Tensor with the same lazydata, but a different device, so it makes a copy.
- `Tensor.realize()`
	- `run_schedule(*self.schedule_with_vars(), do_update_stats = True)`
		- `self.schedule_with_vars()`
			- `create_schedule_with_vars(flatten(self.lazydata.lbs), seen=None)
				- `flatten()` (comes from `helpers.py`) does nothing with the Tensors, just makes the lazybuffers not be nested in multiple lists
				- `_graph_schedule(outs:List[LazyBuffer], seen=set())`
					- `realises: Dict[LazyBuffer, None]` holds all unrealized lazybuffers
					- `for out in outs: _recurse_lb(out.base, realizes, allbuffs = {}, simple_pads = set(), children = defaultdict, scheduled=True)`