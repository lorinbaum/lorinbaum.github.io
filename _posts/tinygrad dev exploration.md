---
date: 2024-06-22T11:27:48+02:00
---
tinygrad tries to be simple. I like deleting things. See if I can't help delete in tinygrad. Seems to be a new and adventurous world on the other side.

# tinygrad dev exploration

[TOC]
## Direction

trace execution of a tinygrad script
- steps:
	- `from tinygrad.tensor import Tensor`
	- `Tensor([1,2,3])`
	- `Tensor([1,2,3]) + 2`
	- `(Tensor([1,2,3]) + 2).tolist()`
- visualize what parts of the script do
	- diff for each step
	- divide by file the lines come from
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
if there is an argument in a function definition like `*`,  it becomes optional and returns an empty tuple (or list?) if not given

### creating a Tensor

```python
from tinygrad.tensor import Tensor
t = Tensor([1,2,3])
```

`from tinygrad.tensor import Tensor` triggers creation of the `Device` singleton, as `tensor.py` imports its, which is useful when creating Tensors.
`Device._devices` stores uppercase strings for devices available in tinygrad as determined by collecting all `tinygrad/runtime/ops_{device}.py` files.

```python
Tensor(
    data: Union[
        None,
        ConstType,
        List,
        Tuple,
        LazyBuffer,
        ndarray,
        bytes,
        MultiLazyBuffer,
        Variable,
    ],
    device: Optional[Union[str, tuple, list]] = None,
    dtype: Optional[DType] = None,
    requires_grad: Optional[bool] = None,
)
```
*Tensor creation from [tinygrad docs](https://docs.tinygrad.org/tensor/:*

determine device for the Tensor using `Device.canonicalize()`, which merely formats `device` if it's not `None`, but since it is, responsibility is handed to `Device.DEFAULT` to find one.
- it looks for `{DEVICE}=1` in environment variables
- if it finds none `{device}Device.__init__({device})` is tried for `METAL`,`AMD`,`CUDA`, `GPU`, `CLANG`, `LLVM` in their respective `runtime/ops_{device}.py`
	- which eventually returns a `Compiled` device, which is cached for later use, but here it is only used to check if the device works and no more.
	- if a device causes no problems, `Device.DEFAULT` returns its string and sets it to 1 as an environment variable
	-  if `DEBUG` > 1, a message is printed informing which device was initialized. `DEBUG` is a `ContextVar` defined in `helpers.py`. There are a few such variables and are initalized when importing from `helpers.py`. They store environment variables, are are shorthand. But not all environment variables relevant to tinygrad are initialized. Which makes this look useless.

depending on type of data, some local helper functions `_loadop()`, `_fromnp` or `_frompy`.
The example Tensor construction above triggers this handling:
```python
elif isinstance(data, (list, tuple)):
      if dtype is None:
        if (d := fully_flatten(data)) and all(isinstance(s, bool) for s in d): dtype = dtypes.bool
        else: dtype = dtypes.default_int if d and all_int(d) else dtypes.default_float
      if dtype == dtypes.bfloat16: data = Tensor(_fromnp(np.array(data, np.float32)), device=device).cast(dtypes.bfloat16).lazydata
      else: data = _fromnp(np.array(data).astype(_to_np_dtype(dtype)))
```
which infers the dtype and then uses numpy to create and cast an array. finally calling `_fromnp`: (numpy as a dependency is phased out, so this probably changes soon)
- a `LazyBuffer` is created using `LazyBuffer.loadop(LoadOps.EMPTY, x.shape, _from_np_dtype(x.dtype), "NPY")` where `x.shape` is numpys function to return array shape.
- `_from_np_dtype` looks up the numpy dtype name in a dictionary from `dtype.py` to get a tinygrad `DType`

```python
def loadop(
	op,
	shape: Tuple[sint,...],
	dtype: DType,
	device: str,
	arg = None,
	src: Tuple[LazyBuffer, ...] = (),
	enable_cache = False
): ...
```

`LazyBuffer.loadop` otherwise does one errorcheck on the `srcs` argument (not supplied here) and produces a `ShapeTracker` through `ShapeTracker.from_shape(shape)` before passing arguments on to a helper function `create_lazybuffer` (further below) which also receives the argument `enable_cache` (`False` by default - if it were `True`, the lazybuffer would be stored in `lazycache`after creation).

`op` was given as `LoadOps.EMPTY`, which ist just a number in  `class LoadOps(Enum)`, 0 in this case.

```python
ShapeTracker.from_shape(shape:Tuple[sint, ...]): return ShapeTracker((View.create(shape),))
```

`ShapeTracker((View.create(shape),))` to give the ShapeTracker a View. Since no stride is defined, it will be created using the helper function `strides_for_shape(shape)`, then canonicalized. Then `View(shape, stride, offset=0, mask=None, contiguous=True)` with these default arguments

```python
@dataclass(frozen=True)
class ShapeTracker:
  views: Tuple[View, ...]
```

```python
@dataclass(frozen=True)
class View:
  shape:Tuple[sint, ...]
  strides:Tuple[sint, ...]
  offset:sint
  mask:Optional[Tuple[Tuple[sint, sint], ...]]
  contiguous:bool
```

in `create_lazybuffer` the `lazycache` is interacted with, a `WeakValueDictionary` storing lazybuffers. a `cache_key` is generated from the lazybuffers parameters and if the key yields an existing `LazyBuffer` from `lazycache`, that one will return, otherwise a new one is created with this constructor:

```python
LazyBuffer(
    device: str,
    st: ShapeTracker,
    dtype: DType,
    op: Optional[Op] = None,
    arg: Any = None,
    srcs: Tuple[LazyBuffer, ...] = (),
    base: Optional[LazyBuffer] = None,
)
```
*from [tinygrad docs](https://docs.tinygrad.org/developer/)*

notably `device` here given to be `"NPY"`, which comes from how the Tensor was initialized. This is different from the device determined at the beginning through `Device.DEFAULT`. Reason for this may become clearer?
`st` is the `ShapeTracker` just created

In the lazybuffer's initialization, it finds that `base` is `None` and decides that an assignment to `self.buffer` is in order.
Given the op `LoadOps.EMPTY`, it makes a `Buffer` (a class imported from `tinygrad.device`) through `Buffer(device, self.size, dtype)`. But creating it like that does nothing except store the instance.
the buffers `_lb_refcount` property is incremented by 1
the `contiguous_child` property (didn't exist before) is set to `None`
and `forced_realize` to `False`
the meaning of all 3 escapes me right now.

The `LazyBuffer` is done and returning to `_fromnp()` into the variable `ret` where:
`ret.buffer.allocate(x)` (x is a numpy array) causes the buffer to find itself an `Allocator`:
`self.allocator = Device[self.device].allocator`. Indexing into `Device` returns a `Compiled` Device (same as earlier when it was about finding an available device, but this time with "NPY")

```python
Compiled (
	device: str,
	allocator: Allocator,
	renderer: Optional[Renderer],
	compiler: Optional[Compiler],
	runtime,
	graph = None
)
```

on `buffer.allocate(x)` where `x` is the np.ndarray, which is just assigned to `buffer._buf`.
`del ret.srcs` (which is cruicial for `LazyBuffer.realized` to return `True`) completes what is commented "fake realize".

In the final step of `Tensor` initialization, the mismatching devices, one being the discovered one and one being "NPY" are detected and `self.lazydata = data.copy_to_device(device)` takes care of it, `data` being the created `LazyBuffer` and `device` being the discovered device from the start.
`LazyBuffer.copy_to_device(device)` in this case leads to `self.base._copy(device)._view(self.st)`

```python
# LazyBuffer._copy:
return create_lazybuffer(device, ShapeTracker.from_shape(self.shape), self.dtype, LoadOps.COPY, self.buffer.nbytes, (self,), enable_cache=False)
```

```python
create_lazybuffer(
	device: str,
	st: ShapeTracker,
	dtype: DType,
	op: Optional[Op] = None,
	arg:Any = None,
	srcs: Tuple[LazyBuffer, ...] = (),
    base: Optional[LazyBuffer] = None,
    enable_cache = bool(getenv("LAZYCACHE", 1))
)
```

`._view(self.st)` does nothing here, because the new shapetracker has the same shape and is contiguous.

The final object looks like this:
TODO: Not true, Tensor has more attributes than lazydata!
```python
Tensor.lazydata {
	'device': 'CUDA',
	'st': ShapeTracker(views=(View(
		shape=(3,),
		strides=(1,), 
		offset=0,
		mask=None,
		contiguous=True
		)
	,)),
	'dtype': dtypes.int,
	'shape': (3,),
	'size': 3,
	'_base': None,
	'op': <LoadOps.COPY: 3>,
	'arg': 12,
	'srcs': LazyBuffer {
		'device': 'NPY',
		'st': ShapeTracker(views=(View(
			shape=(3,),
			strides=(1,),
			offset=0,
			mask=None,
			contiguous=True
			)
		,)),
		'dtype': dtypes.int,
		'shape': (3,),
		'size': 3,
		'_base': None,
		'op': <LoadOps.EMPTY: 1>,
		'arg': None,
		'buffer': <buf real:True device:NPY size:3 dtype:dtypes.int offset:0>,
		'contiguous_child': None,
		'forced_realize': False
	},		
	'buffer': <buf real:False device:CUDA size:3 dtype:dtypes.int offset:0>,
	'contiguous_child': None,
	'forced_realize': False
}
```

### Adding to a Tensor

```python
t = Tensor([1,2,3]) + 2
```

goes to `Tensor.add(self, x, reverse=False)`
-> `return F.Add.apply(*self._broadcasted(x, reverse))`

`self._broadcasted` determines dtype then creates Tensor from `y` (2) using:
`Tensor(dtypes.as_const(y, y_dtype), x.device, y_dtype, requires_grad=False)`
where `dtypes.as_const()` casts the input using one of pythons `int`, `float`, `bool` functions. Reason still escapes me.

bypassing the whole numpy story because data is integer and not array this time, so lazybuffer comes more directly from `_loadop(LoadOps.CONST, tuple(), dtype, device, data)` where `data` eventually ends up as the lazybuffers `arg` property.

The `ShapeTracker` will be empty, because the provided shape is `tuple()`. (its a 0D Tensor - one number)

Because `op` is `LoadOps.CONST` and dtype is `int` the data once again runs through `dtypes.as_const()` and `enable_cache` (-> `lazycache`)  is enabled.

the returned `Tensor` looks like this:
```python
{
	'device': 'CUDA',
	'st': ShapeTracker(views=(View(shape=(), strides=(), offset=0, mask=None, contiguous=True),)),
	'dtype': dtypes.int,
	'shape': (),
	'size': 1,
	'_base': None,
	'op': <LoadOps.CONST: 2>,
	'arg': 2,
	'srcs': (),
	'buffer': <buf real:False device:CUDA size:1 dtype:dtypes.int offset:0>,
	'contiguous_child': None,
	'forced_realize': False
}
```

back in `_broadcasted`, dtypes of x and y are matched
`_broadcast_shape(x.shape, y.shape)` determines a target shape
and broadcast `x` and `y` to that shape (x is already that shape so nothing happens)

`padded = _pad_left(y.shape, shape)` where `shape` is the target shape transforms `()` to `(1,)`, ready to be expanded through `F.Expand.apply(self.reshape(padded), shape=shape)`

`Tensor.reshape` calls `F.Reshape.apply(self, new_shape)` from `function.py`, which inherits from `class Function` in `tensor.py`.
all `Function` "children", in their `apply`function, return a new Tensor and populate it with new `lazydata`, `requires_grad`, `grad=None` and `_ctx` if  applicable. `_ctx` contains the function that was called, which also contains the parent Tensors.
`Function.apply()` calls the functions `forward` method on the `Tensor.lazydata`

`lazydata.reshape` turns into `self._view(st.reshape(newShape))` in `lazy.py`.
In `st.reshape(newShape)` (`shapetracker.py`), by default, the new returned `ShapeTracker` will have its most recent view in `views` replaced by a new one, through `View.reshape(newShape)`.
Environment variable `MERGE_VIEWS=0` changes this behaviour to including all previous views with the new one appended in the new shapetracker.

`View.reshape(newShape)` in this case simply returns a new View from `View.create(newShape)`
strides for the new shape  are determined (`strides_for_shape(shape)` -> `(1,)`) and canonicalized -> `(0,)`.
finally:
```python
contiguous = offset == 0 and mask is None and strides == strides_for_shape(shape)
return View(shape, strides, offset, mask, contiguous)
```

back at `_view(newShapetracker)` in `lazy.py` a new lazybuffer comes from `create_lazybuffer(self.device, new_st, self.dtype, base=self.base)`.
notably, `self.base` is just `self` because `self._base` is `None`
```python
@property
  def base(self) -> LazyBuffer: return self._base if self._base is not None else self
```

Tensor after reshape:
```python
Tensor:
	_ctx = None
	requires_grad = None
	grad = None
	lazydata:
		device = "CUDA"
		st = ShapeTracker(views=(View(
			shape=(1,),
			strides=(0,),
			offset=0,
			mask=None,
			contiguous=True
		),))
		dtype = dtypes.int
		shape = (1,)
		size = 1
		_base = LazyBuffer:
			device = "CUDA"
			st: ShapeTracker(views=(View(
				shape=(),
				strides=(),
				offset=0,
				mask=None,
				contiguous=True
			),))
			dtype = dtypes.int
			shape = ()
			size = 1
			_base = None
			op = <LoadOps.CONST: 2>
			arg = 2
			srcs = ()
			buffer = <buf real:False device:CUDA size:1 dtype:dtypes.int offset:0>
			contiguous_child: None
			forced_realize = False
```

next from `F.Expand.apply(self.reshape(padded), shape=(3,))`, where `self.reshape(padded)` has now returned the new Tensor. Expand similarly returns a new Tensor with a new LazyBuffer from  `LazyBuffer.expand` -> `ShapeTracker.expand` -> `View.expand` -> `View.create(new_shape, self.strides, self.offset, mask)` -> `View` -> `ShapeTracker` -> `LazyBuffer._view` -> `createLazyBuffer` -> `LazyBuffer`

notably, `View.create` does not change strides and since no mask was given it also remains `None`. These lines:
```python
contiguous = offset == 0 and mask is None and strides == strides_for_shape(shape)
return View(shape, strides, offset, mask, contiguous)
```
cause `contiguous` to be `False` because the unchaged stride is `(0,)`, but the the appropriate stride for the new shape would be `(1,)`
Notably, `create_lazybuffer(self.device, new_st, self.dtype, base=self.base)` takes the base of the "reshape lazybuffer" which is the LoadOps.CONST lazybuffer.
So the finally returned Tensor is:

```python
Tensor:
	_ctx = None
	requires_grad = None
	grad = None
	lazydata:
		device = "CUDA"
		st = ShapeTracker(views=(View(
			shape=(3,),
			strides=(0,),
			offset=0,
			mask=None,
			contiguous=False
		),))
		dtype = dtypes.int
		shape = (3,)
		size = 3
		_base = LazyBuffer:
			device = "CUDA"
			st: ShapeTracker(views=(View(
				shape=(),
				strides=(),
				offset=0,
				mask=None,
				contiguous=True
			),))
			dtype = dtypes.int
			shape = ()
			size = 1
			_base = None
			op = <LoadOps.CONST: 2>
			arg = 2
			srcs = ()
			buffer = <buf real:False device:CUDA size:1 dtype:dtypes.int offset:0>
			contiguous_child: None
			forced_realize = False
```

While the expand used the "reshape lazybuffer", there remains no reference to that lazybuffer in the final Tensor.

Finally, `F.Add.apply` is called on the input tensor and the created Tensor.
new tensor lazydata = `return x.e(BinaryOps.ADD, y)` where `BinaryOps.ADD`, like `LoadOps.CONST` is an entry in `class BinaryOps(Enum)`

```python
def e(
	self, 
	op:Union[LoadOps, UnaryOps, BinaryOps, TernaryOps],
	*in_srcs:LazyBuffer,
	arg:Optional[Any] = None
	) -> LazyBuffer
```
gets `out_dtype` from input
tries shortcuts if one of the operants is effectively 0
```python
create_lazybuffer(self.device, ShapeTracker.from_shape(self.shape), out_dtype, op, arg, tuple(srcs))
```

```python
Tensor:
	_ctx = None
	requires_grad = None
	grad = None
	lazydata:
		device = "CUDA"
		st = ShapeTracker(views=(View(
			shape=(3,)
			strides = (1,)
			offset = 0
			mask = None
			contiguous = True
		),))
		dtype = dtypes.int
		shape = (3,)
		_base = None
		op = <BinaryOps.ADD: 1>
		arg = None
		srcs = (
			<LB CUDA (3,) int (<LoadOps.COPY: 3>, None)>, # whole lazybuffer, not writing it out here
			<LB CUDA (3,) int ShapeTracker(views=(View(shape=(3,), strides=(0,), offset=0, mask=None, contiguous=False),))> # whole lazybuffer, not writing it out here
		)
		buffer = <buf real:False device:CUDA size:3 dtype:dtypes.int offset:0>
		contiguous_child = None
		forced_realize = False
```

It seems, tinygrads laziness means that operations are initially stored in lazybuffers that reference other lazybuffers through `srcs` (in ADD) or `_base` (in shape changes) and so form a graph.
```bash
DEBUG=4 CUDA=1 python -c "from tinygrad.tensor import Tensor; (Tensor([1,2,3]) + 2).tolist()"
```
displays a graph that seem to echo this, though shape changes are apparently left out
```
  0 ━┳ BufferOps.STORE MemBuffer(idx=0, dtype=dtypes.int, st=ShapeTracker(views=(View(shape=(3,), strides=(1,), offset=0, mask=None, contiguous=True),)))
  1  ┗━┳ BinaryOps.ADD None
  2    ┣━━ BufferOps.LOAD MemBuffer(idx=1, dtype=dtypes.int, st=ShapeTracker(views=(View(shape=(3,), strides=(1,), offset=0, mask=None, contiguous=True),)))
  3    ┗━━ BufferOps.CONST ConstBuffer(val=2, dtype=dtypes.int, st=ShapeTracker(views=(View(shape=(3,), strides=(0,), offset=0, mask=None, contiguous=False),)))
```

### Realizing a Tensor

```python
(Tensor([1,2,3]) + 2).tolist()
```

`Tensor.tolist()` = `Tensor.data().tolist()` = `Tensor._data().cast(self.dtype.fmt, self.shape).tolist()`

```python
def _data(self) -> memoryview:
    if 0 in self.shape: return memoryview(bytearray(0))
    # NOTE: this realizes on the object from as_buffer being a Python object
    cpu = self.cast(self.dtype.scalar()).contiguous().to("CLANG").realize()
    buf = cast(Buffer, cast(LazyBuffer, cpu.lazydata).base.realized)
    if self.device != "CLANG": buf.options = BufferOptions(nolru=True)
    return buf.as_buffer(allow_zero_copy=True if self.device != "CLANG" else False)
```
`Tensor.cast(self.dtype.scalar())` applies `F.Cast(dtype)`
`Tensor.contiguous()` applies `F.Contiguous()`
 - `LazyBuffer.contigous()`
	 - `LazyBuffer.e(LoadOps.CONTIGUOUS)` in the current case
		 - makes sure dtypes and shapes(?) of all lazybuffers and their bases match
		 - "const folding"(?), which in the current case does nothing
		 - returns a new `LazyBuffer` with all sources (self and bases, in this case only self) in the `srcs` attribute
	- stores a reference and something in self.base.contiguous_child (?)
`Tensor.to("CLANG")`
- if it is not already on CLANG, it makes a new Tensor with the same lazydata, but `device="CLANG"`, so it makes a copy.

```python
def realize(self, *lst:Tensor, do_update_stats=True) -> Tensor:
    run_schedule(*self.schedule_with_vars(*lst), do_update_stats=do_update_stats)
    return self
```

```python 
def schedule_with_vars(
	self,
	*lst:Tensor,
	seen:Optional[Set[LazyBuffer]]=None
) -> Tuple[List[ScheduleItem], Dict[Variable, int]]:

	schedule, var_vals = create_schedule_with_vars(flatten([x.lazydata.lbs for x in (self,)+lst]), seen)
    return memory_planner(schedule), var_vals
```
where `flatten` in this case returns a list with one entry: the "BinaryOps.ADD-lazybuffer" 

from `engine/schedule.py`
```python
SCHEDULES: List = []
def create_schedule_with_vars(
  outs:List[LazyBuffer],
  seen:Optional[Set[LazyBuffer]]=None
) -> Tuple[List[ScheduleItem], Dict[Variable, int]]:

  if seen is None: seen = set()
  graph, in_degree, prescheduled = _graph_schedule(outs, seen)

```

from `engine/schedule.py`
```python
def _graph_schedule(
	outs:List[LazyBuffer],
	seen:Set[LazyBuffer]
) -> Tuple[
	DefaultDict[LazyBuffer, List[LazyBuffer]], DefaultDict[LazyBuffer, int],
	Dict[LazyBuffer, _LBScheduleItem]
]:

  """create a graph for realizing the outputs"""
  # start by just realizing the buffers passed in
  realizes: Dict[LazyBuffer, None] = {x.base:None for x in outs if x.base.realized is None}
  allbufs: Dict[LazyBuffer, None] = {}
  simple_pads: Set[LazyBuffer] = set()
  children: DefaultDict[LazyBuffer, Dict[LazyBuffer, None]] = defaultdict(dict)
  for out in outs: _recurse_lb(out.base, realizes, allbufs, simple_pads, children, scheduled=True)
  ```
strange that it uses `out.base` it means if the latest lazybuffer were a reshape, it would be ignored for now.

from `engine/schedule.py`
```python
def _recurse_lb(
	buf:LazyBuffer,
	realizes:Dict[LazyBuffer, None],
	allbufs:Dict[LazyBuffer, None],
    simple_pads:Set[LazyBuffer],
    children:DefaultDict[LazyBuffer, Dict[LazyBuffer, None]],
    scheduled=False
):

  """recursively search the entire graph for all LazyBuffers, insert realizes after expands"""
  if buf in allbufs or buf.base.realized is not None: return
  if GRAPH: log_lazybuffer(buf, scheduled)
  # view
  if buf.base != buf:
    # fuse some pads
    if len(buf.st.views) == 1 and buf.st.views[-1].mask is not None and all_int(buf.base.st.shape) and \
        prod(buf.base.st.shape) >= prod([y-x for x,y in buf.st.views[-1].mask]):
      simple_pads.add(buf.base)
    # realize all expands
    elif prod(buf.base.st.shape) < prod(buf.st.shape):
      if buf.base.op is UnaryOps.CAST and isinstance(buf.base.srcs[0].dtype, ImageDType) and isinstance(buf.base.arg, ImageDType):
        pass # don't realize image to image casts. this is part of a larger problem
      else:
        realizes[buf.base] = None
    # check all other pads for safe fusion
    elif any(v.mask is not None for v in buf.st.views): simple_pads.add(buf.base)
    return _recurse_lb(buf.base, realizes, allbufs, simple_pads, children)
  # base
  allbufs[buf] = None
  if buf.forced_realize: realizes[buf] = None
  if buf.op in LoadOps: realizes[buf.base] = None
  if buf.op is LoadOps.COPY:
    assert buf.srcs[0].st.contiguous and buf.srcs[0].size == buf.srcs[0].base.size, "can only copy contig"
    realizes[buf.srcs[0].base] = None
  if buf.op is LoadOps.VIEW: realizes[buf.srcs[0].base] = None
  for x in buf.srcs:
    children[x.base][buf] = None
    _recurse_lb(x, realizes, allbufs, simple_pads, children)
```
puts lazybuffers in `allbuffs` dictionary
and loadops into `realizes`

back in `_graph_schedule`:
```python
  assign_targets = {x.srcs[1]:x for x in realizes if x.op is LoadOps.ASSIGN and x not in seen and x.realized is None}

  # check if we have to realize pads
  for p in simple_pads:
    if not _is_padding_okay(p, realizes):
      realizes[p] = None

  # find all reduces, and pair them to a elementwise op. if they can't be cleanly paired, force realize the reduce (or a contig child)
  reduce_for_op: Dict[LazyBuffer, LazyBuffer] = {}
  for r in allbufs:
    if r.op not in ReduceOps or r in realizes: continue

    group: Set[LazyBuffer] = set()
    _recursive_group(r, r.st, r, children, realizes, reduce_for_op, group)
    # max one reduceop per kernel
    can_chase = all(tr not in reduce_for_op for tr in group)
    # TODO: forced_realize exists because the scheduler is incapable of checking for self-contained DAGs
    forced_realize = r in group
    if not forced_realize and len(group) > 1:
      # create a multi output kernel if the LazyBufferss can cleanly group
      rc_parents, rc_children = deque(group), deque(group)
      while rc_parents and not forced_realize:
        # max one reduceop per kernel
        if (p:=rc_parents.pop()).op in ReduceOps: forced_realize = True
        else: rc_parents.extend(x.base for x in p.srcs if x.base.realized is None and x.base is not r)
      # search descendants of the reduceop that can cleanly group
      realized_descendants: Set[LazyBuffer] = set()
      while rc_children and not forced_realize:
        if (c:=rc_children.pop()).op in ReduceOps or not c.st.contiguous or c.st.size != r.st.size or c in reduce_for_op:
          realized_descendants.clear()
          break
        if c in realizes and c not in group: realized_descendants.add(c)
        rc_children.extend(x for x in children[c] if x.realized is None and x.device == r.device)
      group.update(realized_descendants)
    # can only fuse assign if no other assign_target is used in the kernel
    if not forced_realize and any(x.op is LoadOps.ASSIGN for x in group):
      parents = deque((r, *group))
      while parents and not forced_realize:
        if (p:=parents.pop().base).realized or p in realizes:
          if p in assign_targets and assign_targets[p] not in group: forced_realize, can_chase = True, False
          continue
        parents.extend(p.srcs)
    if forced_realize:
      tr = r
      if can_chase:
        # can chase this down to contiguous children
        st = tr.st
        while len(children[tr]) == 1:
          tr_next = next(iter(children[tr]))
          st_childs = dedup(s for s in tr_next.srcs if s.base is tr)
          if len(st_childs) > 1: break
          if st.size != st_childs[0].st.size: break
          st = st + st_childs[0].st
          if not st.contiguous or tr_next.op in ReduceOps: break
          tr = tr_next
        # don't cast to higher size before store (tr cannot be realized if forced_realize)
        if tr.op is UnaryOps.CAST and tr.arg.itemsize > tr.srcs[0].dtype.itemsize:
          tr = tr.srcs[0].base
        reduce_for_op[tr] = r
      realizes[tr] = None
    else: reduce_for_op.update((tr, r) for tr in group)

  output_groups: DefaultDict[LazyBuffer, List[LazyBuffer]] = defaultdict(list)
  for buf in realizes:
    if buf.realized is not None or buf.op is LoadOps.CONST or buf in seen: continue
    output_groups[reduce_for_op[buf] if buf in reduce_for_op and MULTIOUTPUT else buf].append(buf)

    # make things that can't be images not images
    if isinstance(buf.dtype, ImageDType) and (prod(buf.shape) != prod(buf.dtype.shape) or
                                              not any(buf.shape[x]%4 == 0 for x in buf.st.unit_stride_axes())):
      if DEBUG >= 2: print(f"forcing image {buf.dtype} with shape {buf.shape} to float32")
      buf.dtype = dtypes.float32
      # hack the underlying buffer too
      if buf.base is buf:
        assert not hasattr(buf.buffer, '_buf'), "can't fixup allocated buffer"
        buf.buffer.dtype = dtypes.float32
        buf.buffer.options = None

  # preschedule all buffers in realizes
  prescheduled = {group[0]:_schedule_group(tuple(group), realizes, reduce_for_op) for group in output_groups.values()}
  schedule_targets = {out:ps for ps in prescheduled.values() for out in ps.outputs}

  graph: DefaultDict[LazyBuffer, List[LazyBuffer]] = defaultdict(list)
  in_degree: DefaultDict[LazyBuffer, int] = defaultdict(int)
  for key, lsi in prescheduled.items():
    if key not in in_degree: in_degree[key] = 0
    # realize outputs after all parents are realized
    scheduled_parents = set(schedule_targets[x].outputs[0] for x in lsi.inputs if x in schedule_targets)
    for x in scheduled_parents:
      graph[x].append(key)
      in_degree[key] += 1
    # realize outputs before a parent is assigned to
    parents_assigns = set(schedule_targets[assign_targets[x]].outputs[0] for x in lsi.inputs if x in assign_targets)
    for assign in parents_assigns:
      graph[key].append(assign)
      in_degree[assign] += 1

  return graph, in_degree, prescheduled
```

back in `create_schedule_with_vars`
```python
  queue = deque(si for key, si in prescheduled.items() if in_degree[key] == 0)
  schedule: List[ScheduleItem] = []
  var_vals: Dict[Variable, int] = {}
  kernel_number = GlobalCounters.kernel_count
  while queue:
	ps = queue.popleft()
	for buf in ps.outputs: seen.add(buf)
	if GRAPH:
	  kernel_number += 1
	  for out in ps.outputs: realized_lazybuffer(out, kernel_number)
	var_vals = merge_dicts([var_vals, ps.var_vals])
	for out in ps.outputs: del out.srcs  # can only schedule once
	schedule.append(si:=ScheduleItem(ps.ast, tuple(x.buffer for x in (ps.outputs+ps.inputs) if x.size != 0)))
	if logops and si.ast[0].op not in LoadOps and not any(i.device.startswith("DISK:") for i in si.inputs): logops.write(str(si.ast)+"\n")
	for x in graph[ps.outputs[0]]:
	  in_degree[x] -= 1
	  if in_degree[x] == 0: queue.append(prescheduled[x])

  if SAVE_SCHEDULE:
	def _save():
	  print(f"saving {len(SCHEDULES)} schedule graphs to", fp:=getenv("SAVE_SCHEDULE_PATH", "schedule.pkl"))
	  with open(fp, "wb") as f: pickle.dump(SCHEDULES, f)
	if len(SCHEDULES) == 0: atexit.register(_save)
	SCHEDULES.extend((ps.ast for ps in prescheduled.values()) if getenv("CAPTURE_AST") else [(graph, prescheduled)])
  # confirm everything was scheduled correctly
  if not all(degree == 0 for degree in in_degree.values()) or len(prescheduled) != len(schedule):
	raise RuntimeError(f"cycle detected in graph, prescheduled {len(prescheduled)} but only scheduled {len(schedule)}")
  if DEBUG >= 1 and len(schedule) >= 10: print(f"scheduled {len(schedule)} kernels")
  return schedule, var_vals
```


---
watch out for garbo below

### creating tensors through methods

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
To return to later: rest of `Tensor.arange`, other Tensor construction methods and random construction methods:
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




### Detected room for improvement / questions

Some environment variables are stored in `ContexVar._cache` and as `ContextVar` instances and can be imported from `tinygrad.helpers` but others are determined dynamically through `getenv` which is also imported from `tinygrad.helpers` and used like `getenv("LAZYCACHE", 1)`. Not obvious why this added complexity.

`tensor.py` too big, methods more around imitating style than being nicely categorized? Remove stuff like `Tensor.ones` or duplication of `Tensor.transpose` and `Tensor.T`

`Tensor(2).lazydata.contiguous_child` is `None` but
`Tensor(1).lazydata.contiguous_child` is a tuple of weakref to some lazybuffer and its own ShapeTracker ??

beautiful lazy graph and linearized graph in DEBUG=4