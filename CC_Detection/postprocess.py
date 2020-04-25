import cv2 as cv
import numpy as np

# Initialize the parameters
confThreshold = 0.5  # Confidence threshold
nmsThreshold = 0.4  # Non-maximum suppression threshold


def filter_by_confidence(outs, frame):
    frame_height = frame.shape[0]
    frame_width = frame.shape[1]

    # Scan through all the bounding boxes output from the network and keep only the
    # ones with high confidence scores. Assign the box's class label as the class with the highest score.
    class_ids = []
    confidences = []
    boxes = []
    for out in outs:
        for detection in out:
            scores = detection[5:]
            classId = np.argmax(scores)
            confidence = scores[classId]
            if confidence > confThreshold:
                center_x = int(detection[0] * frame_width)
                center_y = int(detection[1] * frame_height)
                width = int(detection[2] * frame_width)
                height = int(detection[3] * frame_height)
                left = int(center_x - width / 2)
                top = int(center_y - height / 2)
                class_ids.append(classId)
                confidences.append(float(confidence))
                boxes.append([left, top, width, height])

    return class_ids, confidences, boxes


# Draw the predicted bounding box
def drawPred(frame, classes, classes_color, _classId, conf, left, top, right, bottom):

    color = classes_color[_classId]

    cv.rectangle(frame, (left, top), (right, bottom), (int(color[0]), int(color[1]), int(color[2])), 5)
    # Draw a bounding box.
    # cv.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 3)

    label = '%.2f' % conf

    # Get the label for the class name and its confidence
    if classes:
        assert (_classId < len(classes))
        # label = '%s:%s' % (classes[_classId], label)
        label = '%s' % (classes[_classId])

    # Display the label at the top of the bounding box
    labelSize, baseLine = cv.getTextSize(label, cv.FONT_HERSHEY_SIMPLEX, 0.5, 1)
    top = max(top, labelSize[1])
    cv.rectangle(frame, (left, top - round(1.5 * labelSize[1])), (left + round(1.5 * labelSize[0]), top + baseLine),
                 (0, 0, 255), cv.FILLED)
    # cv.rectangle(frame, (left, top - round(1.5*labelSize[1])), (left + round(1.5*labelSize[0]), top + baseLine), (255, 255, 255), cv.FILLED)
    cv.rectangle(frame, (left, top - round(1.5*labelSize[1])), (left + round(1.5*labelSize[0]), top + baseLine),
                 (int(color[0]), int(color[1]), int(color[2])), cv.FILLED)
    cv.putText(frame, label, (left, top), cv.FONT_HERSHEY_SIMPLEX, 0.75, (0, 0, 0), 1)


def draw_preds(indices, boxes, _frame, classes, classes_color, class_ids, confidences):
    filter_boxes = []
    filter_classes_ids = []

    for i in indices:
        # draw bounding boxes on image
        i = i[0]
        box = boxes[i]
        left = box[0]
        top = box[1]
        width = box[2]
        height = box[3]
        drawPred(_frame, classes, classes_color,  class_ids[i], confidences[i], left, top, left + width, top + height)

        # append to indices boxes and classes ids - after non maxima
        filter_boxes.append(box)
        filter_classes_ids.append(class_ids[i])

    return filter_boxes, filter_classes_ids


def IOU(box1, box2):
    # determine the coordinates of the intersection rectangle
    x_left = max(box1['x1'], box2['x1'])
    y_top = max(box1['y1'], box2['y1'])
    x_right = min(box1['x2'], box2['x2'])
    y_bottom = min(box1['y2'], box2['y2'])

    if x_right < x_left or y_bottom < y_top:
        return 0.0
    # The intersection of two axis-aligned bounding boxes is always an
    # axis-aligned bounding box
    intersection_area = (x_right - x_left) * (y_bottom - y_top)

    # compute the area of both AABBs
    bb1_area = (box1['x2'] - box1['x1']) * (box1['y2'] - box1['y1'])
    bb2_area = (box2['x2'] - box2['x1']) * (box2['y2'] - box2['y1'])

    # compute the intersection over union by taking the intersection
    # area and dividing it by the sum of prediction + ground-truth
    # areas - the interesection area
    iou = intersection_area / float(bb1_area + bb2_area - intersection_area)
    assert iou >= 0.0
    assert iou <= 1.0
    return iou


# parse name array
def get_name(array, classes):
    name = ""
    if len(array) == 1:
        return str(name[0])
    for i in range(len(array) - 1):
        # detect spaces between digits: abs(x1+w1-x2)/abs(x1 -x2)
        per = abs(array[i][0][0] + array[i][0][2] - array[i + 1][0][0])/abs(array[i][0][0] - array[i + 1][0][0])
        if per > 0.3:
            name += classes[int(array[i][1])] + " "
        else:
            name += classes[int(array[i][1])]
    name += classes[int(array[-1][1])]
    print("name: ", name)
    return name


# parse valid date
def get_valid_date(array, classes, index):
    valid_date = ""
    try:
        valid_date_array = array[index-2: index+3]
    except:
        return ""
    for i in valid_date_array:
        valid_date += classes[int(i[1])]
    print("valid_date: ", valid_date)
    return valid_date


def get_card_type(array):
    if (array[1] == 39) or (array[1] == 40):
        print("card_type: visa")
        return "visa"

    if (array[1] == 38) or (array[1] == 41):
        print("card_type: mastercard")
        return "mastercard"


# parse card number
def get_card_number(array, classes):
    card_number = ""
    _sum = 0
    for i in range(len(array) - 1):
        # detect spaces between digits: abs(x1+w1-x2)/abs(x1 -x2)
        per = abs(array[i][0][0] + array[i][0][2] - array[i + 1][0][0])/abs(array[i][0][0] - array[i + 1][0][0])
        if 0.30 <= per:
            card_number += classes[int(array[i][1])] + " "
        else:
            card_number += classes[int(array[i][1])]
    card_number += classes[int(array[-1][1])]
    print("card_number: ", card_number)
    return card_number


# Remove the bounding boxes with low confidence using non-maxima suppression
def postprocess(_frame, outs, image_name):

    # Load names of classes
    classesFile = "models/classes.names"

    classes = []
    with open(classesFile, 'rt') as f:
        classes = f.read().rstrip('\n').split('\n')

    # random color for each class
    classes_color = []
    i = 0
    while True:
        color = list(np.random.choice(range(256), size=3))
        if color in classes_color:
            continue
        classes_color.append(color)
        i += 1
        if i >= 43:
            break

    class_ids, confidences, boxes = filter_by_confidence(outs, _frame)

    # Perform non maximum suppression to eliminate redundant overlapping boxes with
    # lower confidences.
    indices = cv.dnn.NMSBoxes(boxes, confidences, confThreshold, nmsThreshold)

    filter_boxes, filter_classes_ids = draw_preds(indices, boxes, _frame, classes, classes_color, class_ids, confidences)

    # card details dictionary
    card_details_dict = {}

    """ Arrange digits by correct order: """
    # The detections return in mix order
    # first: sort by y
    sorted_by_y = sorted(zip(filter_boxes, filter_classes_ids), key=lambda x: x[0][1])
    cv.rectangle(_frame, (0, 0), (490, 105), (0, 0, 0), cv.FILLED)

    # detect visa or mastercard and delete box from array:
    card_type = ""
    for item in sorted_by_y:
        if 38 <= item[1] <= 41:
            if not card_type:
                card_type = get_card_type(item)
                card_details_dict["card_type"] = card_type
                cv.putText(_frame, "Card type : " + card_type, (10, 100), cv.FONT_HERSHEY_DUPLEX, 0.75, (255, 255, 255), 2)
            sorted_by_y.remove(item)

    # split to groups (valid, card number, name)
    arrays = []
    j = 0
    for i in range(len(sorted_by_y)):
        # add last element
        if i == (len(sorted_by_y) - 1):
            temp = [x for x in sorted_by_y[j:i + 1]]
            arrays.append(temp)
            continue

        y1 = sorted_by_y[i][0][1]
        y1_h = sorted_by_y[i][0][1] + sorted_by_y[i][0][3]
        y2 = sorted_by_y[i+1][0][1]
        y2_h = sorted_by_y[i+1][0][1] + sorted_by_y[i+1][0][3]
        per = abs(y1_h-y2)/abs(y1-y2_h)

        if per > 0.5:
            continue
        else:
            # if distance is above 20: enter all values below to array and continue
            temp = [x for x in sorted_by_y[j:i+1]]
            arrays.append(temp)
            j = i+1

    # second: sort by x every group
    name = ""
    valid_date = ""
    card_number = ""
    for array in arrays:
        sort_by_x = sorted(array, key=lambda x: x[0][0])

        # card number
        if (0 <= sort_by_x[0][1] <= 9) and (not card_number):
            card_number = get_card_number(sort_by_x, classes)
            card_details_dict["card_number"] = card_number
            cv.putText(_frame, "Card number : " + card_number, (10, 25), cv.FONT_HERSHEY_DUPLEX, 0.75, (255, 255, 255), 2)
        # name
        if (10 <= sort_by_x[0][1] <= 35) and (not name):
            name = get_name(sort_by_x, classes)
            card_details_dict["full_name"] = name
            cv.putText(_frame, "Card holder : " + name, (10, 50), cv.FONT_HERSHEY_DUPLEX, 0.75, (255, 255, 255), 2)
        # valid
        for index, item in enumerate(sort_by_x):
            if (item[1] == 36) and (not valid_date):
                valid_date = get_valid_date(sort_by_x, classes, index)
                card_details_dict["valid_date"] = valid_date
                cv.putText(_frame, "Card valid date : " + valid_date, (10, 75), cv.FONT_HERSHEY_DUPLEX, 0.75,
                           (255, 255, 255), 2)

    cv.imwrite("output_imgs/output_" + image_name, _frame)

    return card_details_dict

