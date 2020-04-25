from flask import Flask, request, Response
from detection import detect_card_details
from flask_restful import Resource, Api
import jsonpickle
import numpy as np
import cv2
import argparse

app = Flask(__name__)
api = Api(app)


class GetPicture(Resource):
    def post(self):
        img = request.files['image'].read()
        # convert string of image data to uint8
        nparr = np.fromstring(img, np.uint8)
        # decode image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        cv2.imwrite("output_imgs/raw_output.jpg", img)

        # detect credit card
        card_details = detect_card_details(img, prepro=True)

        # check if any details return
        if card_details:
            card_details["status"] = True
        else:
            card_details["status"] = False

        # Add missing keys
        if "card_type" not in card_details:
            card_details["card_type"] = ""
        if "card_number" not in card_details:
            card_details["card_number"] = ""
        if "valid_date" not in card_details:
            card_details["valid_date"] = ""
        if "full_name" not in card_details:
            card_details["full_name"] = ""

        # encode response using jsonpickle
        response_pickled = jsonpickle.encode(card_details)

        return Response(response=response_pickled, status=200, mimetype="application/json")

    def get(self):
        return {"get": "hello friend <3"}


api.add_resource(GetPicture, '/pic')


if __name__ == '__main__':
    # Parse program arguments
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", help="Enter your host ip", default='127.0.0.1')
    parser.add_argument("--port", help="Enter your port", default="5000")
    parser.add_argument("--dev", help="Enter True for development server", default=False)
    args = parser.parse_args()

    # run server
    app.run(debug=args.dev, host=args.host, port=args.port)
