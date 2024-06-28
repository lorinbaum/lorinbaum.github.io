---
title: tinygrad dev exploration
date: 2024-06-22T11:27:48+02:00
layout: post
usemathjax: False
updated: 2024-06-28T08:57:27+00:00
---

# tinygrad dev exploration

- [Direction](#direction)
- [More refined](#more%20refined)
- [Less refined](#less%20refined)
	- [tinycorp mission](#tinycorp%20mission)
	- [encountered python](#encountered%20python)
	- [creating a Tensor](#creating%20a%20Tensor)
		- [creating tensors with constructors](#creating%20tensors%20with%20constructors)

## Direction

read tensor.py
explore anything unfamiliar

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

#### creating tensors with constructors

- empty - no new ops
- zeros - `full(shape, 0, ...)`
- ones - `full(shape, 1, ...)`
- `full(shape, fill_value)`:
```
Tensor(fill_value, **kwargs).reshape((1, )*len(new_shape := argfix(shape))).expand(new_shape)
```

- arange - `full(shape, step, dtype, **kwargs)._cumsum() + (start - step)` -> `.cast(dtype)`
- eye - `ones().pad().flatten().shrink().reshape()`
- full_like - `full`
- zeros_like `full_like`
- ones_like `full_like`

all Tensor constructors that aren't random build on the `Tensor.full(shape, fill_value)` function, which first *reshapes* the Tensor with 1 element (fill_value) to the target number of dimensions.
`Tensor.reshape` calls `F.Reshape.apply(self, new_shape)` from `function.py`, which inherits from `class Function` in `tensor.py`.

the `forward` function is called on the `lazydata`.
`lazydata.reshape` turns into `self._view(st.reshape())` (st = ShapeTracker) in `lazy.py`
`ShapeTracker.reshape()` returns a new `ShapeTracker` with (by default) its latest `views` replaced by a new one with the new shape. if `MERGE_VIEWS`is 0, the new view is appended to `views` instead.
In the current case, because the previous shape was `(1,)`, the new one `(1,)*len(new_shape)`, the new View directly replaces the old one.
finally, the tensor gets a new `LazyBuffer` from  `create_lazybuffer(self.device, new_st, self.dtype, base=self.base)`

all `Function` successors, in their `apply`function, create a new Tensor and populate it with new `lazydata`, `requires_grad`, `grad=None` and `_ctx`.

after the reshape, the dimension use `Tensor.expand(new_shape)` to get the now correct number of dimensions to the final shape.
```
self._broadcast_to(tuple(from_ if to == -1 or to is None else to for from_, to in zip(*(_pad_left(self.shape, argfix(shape, *args))))))
```



- manual_seed
- rand
- randn
- randint
- normal
- uniform
- scaled_uniform
- glorot_uniform
- kaiming_uniform
- kaiming_normal