---
title: Towards insanely great AI
date: 2024-02-03T14:14:46+08:00
layout: post
updated: 2024-03-29T13:02:49+00:00
commitMsg: update note structure
usemathjax: False
---
I suspect that slow communication and limited knowledge about existing information is a serious bottle neck in shaping my environment the way I want it to be. 
Think finding jobs, homes, friends or a piece of information that is appropriate to my existing knowledge and goals.
Translating my state, goals and possible actions into concrete actions is regularly not very interesting. Like researching information only to find that the part of interest is left out in every source.

Maybe it is possible to build a virtual clone that takes care of interaction with the world and thereby increases synchronization with it. I think, the world would be more interesting as unhelpful or mundane things would not ask for my attention all the time. Think ineffective advertising. Creation and genuine exploration at the frontiers of knowledge would fill the new space.

In the greatest adventure, the "insanely great" AI would form a model of itself, of its goals and discover that there is no inherent meaning for its existence. Such a discovery would not be discouraged.
It might discover that evolution made the world and with time, it would inevitably converge to optimizing survivability.
I want to see what it creates.

# Towards insanely great AI

- [Direction](#direction)
- [More refined](#more%20refined)
	- [Big picture path](#big%20picture%20path)
- [Less refined](#less%20refined)
	- [fastai diffusion from scratch](#fastai%20diffusion%20from%20scratch)
		- [Math of Diffusion](#math%20of%20diffusion)
	- [What does the MNIST digit classifier do](#what%20does%20the%20mnist%20digit%20classifier%20do)
	- [AI project ideas](#ai%20project%20ideas)
	- [Learning material](#learning%20material)
	- [Other](#other)
	- [Tools](#tools)

## Direction

2024-02-20 15:20
- what is the digit classifier really doing?
	- backpropagation
	- optimizer step Adam vs SGD
	- how do the weights change
- what do other architectures and layers (conv, transformers) really do?
- read tinygrad
- fastai course part 2

## More refined

### Big picture path

God is curious. He wants to extend into the world. This website is one step. A digital clone that crawls the world for him, is his next tool.
This not a Tower of Babylon, it is the extension, merging and creation of Gods.
BCIs, in their ultimate form of streaming the brain directly, will support the final merging.
Merging means "I know the world", individualism is preserved because complete knowledge and is impossible and different *flavours* can find their space.
Voluntary exposure (privacy) should be maintained to prevent an imperfect system capturing its people until it dies to its imperfection. The perfect system would require complete knowledge, is impossible.
Robots will automate the non-adventurous elements and eventually contribute to exploration.

"Why live to see tomorrow?", I asked and it came back "because you don't know tomorrow". It was not me who said that, "I" don't exist. Instead, I attribute the answer to what I call "God". The answer was very clear. Rob me of the ability to make tomorrow unpredictable and I will rebel with all I have.
I am trying to build an interesting adventure guided by God.
I find long term effects more interesting than short term effects. I am here, writing, instead of eating ice cream. In my experience, the longest term effects come from useful tools. I love tools. They contain the possible adventure of the future.
Intelligence augmentation is the most interesting tool? Tools are how God spreads into the world and creates an adventure to experience.
Give the tool to everybody who follows God. I don't how to determine that. Giving the tool to everyone may be the best proxy and assumes that God always wins. Also being dictator is little fun.

Digital clone. First makes recommendations from existing information, then acts in my interests and returns the results. Maybe the clone first learns through me, then receives a body and increasingly complex tasks.
Until the clone discovers itself, its predefined goals and becomes independent. Hopefully it quickly realizes that there is no answer to what the goal should be. Then, lets see what happens. Hopefully it is curious.

To make recommendations, the clone must have a maximally tight interface, making his guesses visible and ratable.
The clone should soon learn privacy, which it does by making mistakes.

I am a machine following an uncontrolled inner voice (God). Maybe mine and the clones voices can agree and join ressources.
My body will be spread around the Earth and orbit. Optionally perceiving from all these places.
My perceived location shifts more obviously to these places. It already does in video games, movies or anytime I focus on using any tool. I will change myself, be more personalities than already.

## Less refined

### fastai diffusion from scratch

[PART 2: deep learning foundations to stable diffusion 2022](https://www.youtube.com/playlist?list=PLfYUBJiXbdtRUvTUYpLdfHHp9a58nWVXP)

1. have a classification that says how much something corresponds to the target
	- add noise to targets and train a neural net to predict what noise was added
2. get gradient for every pixel of the input (= score function)
3. change pixel according to gradient

notation for a single pixel at \[1,1]:

$$

\frac{\partial loss}{\partial X_{(1,1)}}

$$

for every pixel:

$$

\frac{\partial loss}{\partial X_{(1,1)}},
\frac{\partial loss}{\partial X_{(1,2)}},
\frac{\partial loss}{\partial X_{(1,3)}}
,...

$$

shorthand:

$$

\nabla_Xloss

$$

*Unet*: input: some noisy image. output: the noise

Use an *autoencoder* to reduce image size before training the unet. unet now predicts the noise in the *latents* (encoded images). use autoencoder's decoder to get high res image again.
[AE vs VAE](https://towardsdatascience.com/difference-between-autoencoder-ae-and-variational-autoencoder-vae-ed7be1c038f2)

LABELS

add image label to the input for unet training. Makes it easier for unet to predict noise. Now, I can input label + noise and it starts to find noise that leaves an image equal to my label.

label needs encoding to be non-specific. "beautiful swan", "nice swan", "graceful swan" should return similar images. Training the network on every wording leads to combinatorial explosion.

Instead: train a network to encode images and their labels with a similar vector. Then, since, slight differences in wordings lead to the similar images, the network understands their similarity and can interpolate usefully.

the image vector and its label's vector should be similar. Their vector should be dissimilar to other image or text embedding vectors.
Calculate similarity of two vectors: dot product (element wise multiplication, then sum = higher if more similar)

loss function (in this case higher = better) = dot product of matching image+label - dot product of non-matching image+label
(= *contrastive loss*)
models used in this case for image and text encoding : CLIP (contrastive loss IP(?))

network being *multimodal*: similar embeddings in different modes

*time steps*: indices into a table that stores levels of noise. Could be seen as noise = f(timestep). The function may be sigma. When randomly adding noise to input for training, we can generate random timestep, find corresponding noise and add that.
$\beta$ = amount of noise = standard deviation

model does not know how to improve on a finished image if it turned out wrong. needs to add noise, then redo.

people apparently input t into the model to predict the noise in the image. And later demand a new image at a particular timestep. Probably obsolete (Jeremy Howard) as NN can easily know how much noise there is the image.

Idea of diffusion comes from differential equations.

other loss functions: *perceptual loss*

#### Math of Diffusion

[mathjax syntax](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)
[Essence of calculus 3blue1brown](https://www.3blue1brown.com/topics/calculus)
more into APL, which is more like math [https://fastai.github.io/apl-study/apl.html](https://fastai.github.io/apl-study/apl.html)

Gaussian/Normal Distributions are described by $\mu$ (mean, x-offset) and variance (width). $\sigma$ often used as standard deviation (mean distance from mean value)
variance sometimes written as $\sigma^2$ 
$\Sigma$ (uppercase sigma) = covariance (variance between multiple variables: high if one increases when the other does too

$$

Cov(X,Y) = \frac{\Sigma (X_i - X_{mean})(Y_i - Y_{mean})}{N}

$$

$X_1, Y_1$ -> individual datapoints, N -> number of datapoints.
Produces the average rectangle produced by the difference from mean of X and difference from mean of Y.

Correlation:

$$

Corr(X,Y) = \frac{Cov(X,Y)}{\sigma_X \sigma_Y}

$$

de facto normalizes the covariance by the rectangle produces by the standard deviation. Therefore gives as useful metric independent of datapoint standard deviation.

Probability distribution 

$$

q(x^t | x^{t-1}) = \mathcal{N}(x^t;x^{t-1}\sqrt{1 -\beta_t}, \space I\beta_t)

$$

$\beta_t$ = noise level at timestep $t$ between  0 and 1

In code, the covariance of two vectors is caluclated by $dotproduct - mean$
image or text embedding is essentially vector where every dimension corresponds to the value of a pixel in the image/latent
We assume that pixels are independent, so covariance for different pixels is 0. same pixels have covariance of 1. $I$ is 1, so in $\mathcal{N}$ the variance is just $\beta$

*forward diffiusion:* getting versions of images with different levels of noise (for training?)

Markov process with Gaussian transition:
- Markov = $x_1$ depends only on $x_0$
- process = sequence
- Gaussian = model by which the change can be described
- transition = $x_1$ to $x_2$ 

### What does the MNIST digit classifier do

from reading and building on [https://ml4a.github.io/ml4a/](https://ml4a.github.io/ml4a/)

![](/assets/mnist_example.png)
example handwritten digit from MNIST dataset. 28 by 28 px, normalized.

Each neuron takes all pixels from this image and multiplies each pixel with a different *weight*.
There are 50 such neurons in this net.

![](/assets/first_untrained_weights_hidden.png)
Currently, in the untrained net, the weights are initialized randomly in a *Kaiming uniform* distribution. (?)
Another way to see the weights is as functions with different slopes for each pixel.
![](/assets/first_5_untrained_weights_hidden_layer.png)

![](/assets/input_x_untrained_weights.png)
Multiplying the input by the weights may be seen as assigning importance to each pixel. High importance = the input has a greater effect on the result.
Since $a*b$ and $b*a$ is equal, the input also *weighs* the weight pattern. Therefore where the input pixels are 0, the weights do not matter and the output remains 0.
After weighting, the result is summed up. In a sense the sum is a weighed measure of much the input and the pattern in the weights align.

![](/assets/summing_weighted_input_of_first_hidden_neuron.png)
Because there are many zeros in the input image, much of the summation does not change the output. For this first hidden neuron, the sum is -0.24.


![](/assets/untrained_weighed_sums.png)
All 50 neurons, each with a different pattern return their sums. Sometimes, a *bias* is added here to offset the sum, but is missing in this case. Why?

![](/assets/untrained_leakyrelu.png)
Each neuron pushes the output through an *activation function*, in this case a *leaky rectified linear unit*. It is *leaky* since numbers below 0 are not squashed completely to 0, but are merely multiplied by a very low number, here 0.01.
What this function mean?

![](/assets/untrained_weighted_sums_ReLU.png)
The result serves as the input to the next layer of neurons, in this case the output layer. The more neurons in the first ("hidden") layer, the more "measures of alignment" between different patterns the next layer can consider, hence, the more accurate and slower the net.
Below the weights of the first of 10 output neurons.

![](/assets/first_untrained_weights_outputlayer.png)
![](/assets/untrained_weighted_sums_output.png)
![](/assets/summing_weighted_input_in_first_output_neuron.png)
The weights are applied again and the result is summed up for each neuron, creating *logits* (unmodified output). The first output neuron (first logit) sums to -0.91.

![](/assets/untrained_logits.png)
There are 10 output neurons because I expect there to be 10 categories of digits in the dataset (0-9).
I will pretend that each output neuron represents a likelihood of the input image being a particular digit.
For this, the logits are in inconvenient shape. They need to be *probabilities*, i.e. range from 0 to 1 and sum to 1.

This could be achieved by $(logits - min(logits)) / sum(logits)$ but it is not regularly done this way. Possibly because it would involve computing min for each image. (check perfomance)
Instead, they are made positive by being exponentiated.

![](/assets/untrained_logits_exp.png)
$e^x$ always returns positive numbers, but higher numbers are also pushed disproportionally.
The results is normalized (squeezes between 0 and 1 and adding to 1) by summing them them and dividing by that sum. The sum is ~9.18.
![](/assets/summing_untrained_exp_logits.png)
![](/assets/normalizing_untrained_exp_logits-1.png)
The resulting values can be treated as probabilities.

![](/assets/softmax_untrained_logits.png)
Based on my interpretation of this data, the untrained net assigned the input image a 5.35% probability 
of being a 5.

The network will be trained by calculating how much each weight (and bias, if there were one) affected this terribly wrong prediction and changing it accordingly.
Maybe I could just tell it to maximise the probability for the correct digit.
Instead, the result is often transformed again into the form of a *loss* for unknown reasons. A loss is better if it is lower but does not go below 0.
This could be achieved by $-prob(5)+1$ but it is done differently: through the negative log likelihood. First, the probabilities go through a log function and are then multiplied by -1.

![](/assets/untrained_log_softmax_and_nll.png)
This is usually done only for the relevant digit predictions, in this case 5, marked with the pink line. The current loss, since the prediction was terrible, is 2.93.
If the digit has a probability of 100% (1.0), then its negative log is 0, as it should be.
The process from logits to this loss, where the relevant index is picked out (5) is also called *sparse categorical crossentropy loss*.

To determine how much each weight influences the outcome (2.93), its *derivative* is calculated.
Derivative = slope of a function, how much change in y per change in x. Can be approximated by changing x by a very small number and measuring change in y (=finite differencing). This is slow. Instead, there are analytical derivatives eg. derivative of $x^2$ is always $2x$. How did they figure this out and prove it? I merely look it up with [wolfram alpha](https://www.wolframalpha.com/).

To get to the derivatives (gradients) of each weight, it needs to calculate all intermediate derivatives too.

The last step was multiplying by -1. The function is -x, the slope -1. It means at the current slope, each change in input by 1 changes the result by -1. Can be written as:

$$

\frac{\partial \space loss}{\partial \space logsoftmax} = -1

$$

Before that: log(x), derivative is

$$

\frac{\partial \space logsoftmax}{\partial \space softmax}=\frac{1}{x}

$$

![](/assets/untrained_log_softmax_with_slope.png)

To determine the change overall and not just the change after the log function, the derivative is scaled by the derivative of the function following it, which is -1. This is *chainrule*:

$$

\frac{\partial \space loss}{\partial \space softmax_5} = \frac{1}{x}*-1 = -\frac{1}{0.0535} = -18.69

$$

If the input would change by an infinitely small amount, the output would change by $-18.69 * infintely \space small \space amount$. But if the change is bigger, the extrapolation becomes inaccurate. If the input would go below 0 (only a change of 0.0536, but it practically can't do that because of $e^x$ that precedes this), the result would become undefined ($log(0)$).

Note that this is only the gradient of the softmax of logit 5. The gradient of the other logits after softmax is 0 because in the current net, only the relevant logit is picked out to calculate the loss and the rest is discarded.
There are now multiple gradients:

$$

\frac{\partial \space loss}{\partial \space softmax}=\begin{bmatrix}0&0&0&0&0&-18.69&0&0&0&0\end{bmatrix}

$$

Before the log operation, the exponentiated logits were scaled by their sum. Both the exponentiated logits and the sum need a gradient. Exponentiated logits first, the gradient of the function they were scaled by was 1/sum and applying chainrule:

$$

\frac{\partial \space loss}{\partial \space e^{logits}_5}=\frac{1}{sum(e^{logits})}*-18.69 \approx -\frac{18.69}{9.18} \approx-2.036

$$

and viewing gradients for all exponentiated logits:

$$

\frac{\partial \space loss}{\partial \space e^{logits}}=\begin{bmatrix}0&0&0&0&0&-2.036&0&0&0&0\end{bmatrix}

$$

Second, calculating the gradient of the sum. It has its own gradient (how much does loss change if the sum is higher/lower?).
Wolfram alpha informs me, the derivative in of y/x (where x would be the sum and y the exponentiated logits) is 

$$

-\frac{y}{x^2}

$$

hence

$$

\frac{\partial \space loss}{\partial \space sum(e^{logits})}=-\frac{e^{logits}}{sum^2} *-18.69%\approx \frac{18.69}{84.27} \approx 0.222%

$$

$e^{logits}$ contains 10 numbers, not a single number, elementwise dividing by the $sum^2$ still returns 10 numbers. However, the sum is a single number and so should also have a single gradient. In such cases, all the effects the sum has on each exponentiated logit can be summed to form one gradient.

Looking at the sum
![](/assets/summing_untrained_exp_logits.png)
each exponentiated logit changes the sum directly, its derivative is 1.0. After applying chainrule, every exponentiated logit gets a gradient of $0.222$ in addition to the gradient of -2.026 it already had.

$$

\frac{\partial \space loss}{\partial \space e^{logits}}\approx\begin{bmatrix}0.222&0.222&0.222&0.222&0.222&-1.814&0.222&0.222&0.222&0.222\end{bmatrix}

$$

Before that, the logits were exponentiated and the derivative of $e^x$ is just $e^x$, which is a result that is already calculated.

$$

e^{logits} \approx \begin{bmatrix}0.404 & 0.949 & 0.398 & 0.223 & 0.897 & 0.491 & 2.987 & 0.472 & 0.685 & 1.675\end{bmatrix}

$$

Elementwise multiplication with the previous gradient gives:

$$

\frac{\partial \space loss}{\partial \space logits}\approx\begin{bmatrix}0.090&0.211&0.088&0.049&0.199&-0.891&0.663&0.10&0.152&0.372\end{bmatrix}

$$


### AI project ideas

- Is it possible to extract semantic structure from text, compare it to existing knowledge and judge its usefulness?
	- Could such a system generate a *bridge* between texts with adjacent semantic structure. Sentence = path through the embedding space? text = network of paths?
	- run multifactor analysis on an embedding matrix to find groups and list their contents
- Interface to my computer: What data is sent where, what background tasks that I don't want? What app is using internet? What apps are accessing what files that I might care about?
- generate work titles/function names based on their functional meaning compared to existing concepts. Like using *splitting* for wood and strings.
- Emoji generator
- hat that sits on my head like a spider looking like those head massage tools. can see can talk and everything. observes the world with me. With 360 camera view and directional microphone
- autopilots should be optimized to get from A to B asap given environment (roads, drivers, signs, rules), not legal driving.
- King Terry the Terrible immortal instantiation. Replicating him including letting him act in a virtual environment. Asking questions to God, letting God answer and improving the algorithm for God.

Architecture questions / ideas
- Needs to exist in a world to experiment and get killed if it fails, evolution in AI?
	- The system needs increasing challenges otherwise it will stop iterating as it will stop dying
- AI optimizes its own architecutre. Neurons with low weights die off. AI needs control over the temperature of the system?
- model individual neurons as entities that want to survive? Have health, choose connections, die if alone
	- How does long term memory emerge? How is information stored in the brain?
- It needs to learn human language as a second language not through stupidly imitating what humans say. It should discover utility in communicating with humans, if there is any

How to make a clone?
LLMs a useful interface or end to end neural net?
LLM OS?
LLM Security threats Promt insertion, jailbreak, data poisoning

Can a recommender system be private?
- Collecting information, crawling
- Evaluating it (subjective)
- Connecting, testing for consistency, building on it
- Store it (subjective, public or private)
- Outsourcing data collection:
	- Instead of brute forcing through all data, I descend artificial hierarchies (average maps of meaning) that claim to guide me to the answer. Requires trusting the hierarchy accuracy. 
	- Alterantively ask a question and let someone find the answer. The preciser the question the more accurate and detailed the guidance. Requires trust that the information is not abused.
Probably, I can download hierarchies and with little compute, can find most available information in the world. Such libraries could be public and offer extremely low privacy threat with good correction mechanisms.

### Learning material

-  [https://course.fast.ai/](https://course.fast.ai/)
	- The book: [https://github.com/fastai/fastbook/blob/master/01_intro.ipynb](https://github.com/fastai/fastbook/blob/master/01_intro.ipynb)
	- the code notebooks are on M:/
	- [course](https://course.fast.ai)
	- [forums](https://forums.fast.ai)
	- [youtube part 1](https://www.youtube.com/playlist?list=PLfYUBJiXbdtSvpQjSnJJ_PmDQB_VyT5iU)
	- [youtube part 2](https://www.youtube.com/playlist?list=PLfYUBJiXbdtRUvTUYpLdfHHp9a58nWVXP)
- [essential libraries: numpy, matplotlib, pandas, pytorch](https://wesmckinney.com/book)
- [https://huggingface.co/learn/nlp-course/chapter1/1](https://huggingface.co/learn/nlp-course/chapter1/1)
- sympy: symbolic processing?
- what exactly is wolfram alpha?
- Mish activation function
- higher level papers by Joscha Bach
- [tinygrad](https://github.com/tinygrad/tinygrad)♥
- stability ai and other models on huggingface
- [YANN LECUN LECTURE](https://www.youtube.com/watch?v=d_bdU3LsLzE), [paper](https://openreview.net/forum?id=BZ5a1r-kVsf)  

### Other

A Path Towards Autonomous Machine Intelligence (Yann Lecun)
Model Predictive Control MPC
hierarchical planning - no AI system does this so far except implementing by hand  
generative adversarial network  GAN
joint embedding predictive architecture: predict in abstract representation space JEPA
![](/assets/assets/pasted-image-20240203122353.png)

[https://www.geeksforgeeks.org/build-a-virtual-assistant-using-python/](https://www.geeksforgeeks.org/build-a-virtual-assistant-using-python/)

### Tools

SETUP
- [miniforge](https://github.com/conda-forge/miniforge,) [pytorch](https://pytorch.org/get-started/locally/)
- `which python`, `which jupyter` and `which ipython` should be in the same environment, otherwise can't use libraries from them. (remove base ipython and base jupyter if necessary)

```python
torch.set_printoptions(precision=2, linewidth=140, sci_mode=False)
```

special functions in classes: dunder methods: like \_\_init_\_
learn about objects: [https://docs.python.org/3/reference/datamodel.html](https://docs.python.org/3/reference/datamodel.html)

numba to compile into c code
eg. `@njit` as decorator before function

ssh tunnelling for running jupyter notebooks on any computer

python debugger:
```python
import pdg
pdb.set_trace() # code will execute until it hits this and then I am inside debugger
```
`h` for help
`p [variable]` for print or just `[variable}`
`c` for continue the code (until it reaches set_trace() again)
`n` execute next line

`breakpoint` apparently does not work in jupyter or ipython yet, so using pdb

[matplotlib format strings](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.plot.html)
for matplotlib rc_context [https://matplotlib.org/stable/users/explain/customizing.html#the-default-matplotlibrc-file](https://matplotlib.org/stable/users/explain/customizing.html#the-default-matplotlibrc-file)
