# Project Title

"Detect credit card" is a deep learning project that detects credit card digits (name, number, valid date, type: visa/mastercard)

## Getting Started

clone 'url'

### Prerequisites

python >= 3.6

python libraries:
- opencv-python (cv2)
- flask
- flask_restful
- jsonpickle
- numpy

### Installing

Install libreries using pip3

```bash
pip3 install opencv-python

pip3 install jsonpickle

pip3 install flask_restful

pip3 install numpy
```

## Usage

1. Standalone application

```bash
python3 main.py <image_path> 
```

**Image shold be credit card image with minimum background.**


2. Rest API - running https server

```bash
python3 REST_api.py <host_ip> --host <host_ip> --port <port_number>
```

Default argument:

--host = 127.0.0.1 (local host)
--port = 5000

clinet url should be POST method and looks like this:  http://127.0.0.1:5000/pic
**Attach to the request credit card image that filmed from Simplify application.**

## Authors

* **Shira Levy** - *Initial work* - [Shira Star](https://github.com/ShiraStarL)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

"It is only with the hurt one can see rightly, what is essential is invisible to the eye" [Le petit prince](https://i.pinimg.com/originals/d5/0d/44/d50d44dfc6cfbc89f9f27d582fe401e7.jpg) 

