# Credit Card Detection

"Credit Card Detection" is a deep learning project that detects credit card digits (name, number, valid date, type: visa/mastercard)

## Getting Started

clone project

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
pip3 install -r requirements.txt
```

## Usage

1. Standalone application

```bash
python3 main.py <image_path> 
```
Option: image_path = examples/1.jpg  or  image_path = examples/2.jpg

**Image shold be credit card image with minimum background.**


2. Rest API - running https server

```bash
python3 REST_api.py
```

Optional:
```bash
python3 REST_api.py --host <host_ip> --port <port_number>
```

Default argument:

--host = 0.0.0.0

--port = 5000

clinet url should be POST method and looks like this:  http://<host_ip>:<port_number>/pic

**Attach to the request credit card image that filmed from Simplify application.**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

"It is only with the hurt one can see rightly, what is essential is invisible to the eye" [Le petit prince](https://i.pinimg.com/originals/d5/0d/44/d50d44dfc6cfbc89f9f27d582fe401e7.jpg) 

