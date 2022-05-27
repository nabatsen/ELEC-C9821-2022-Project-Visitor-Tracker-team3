import cv2
import numpy as np
from openvino.inference_engine import IECore
import sys
import time, datetime
import threading
import requests

# Configurable parameters
VIDEO_SOURCE = "./MOT20-02-raw.mp4"
#VIDEO_SOURCE = 0
SHOW_IMG = True
MODEL_LOCATION = "./model/person-detection-0202.xml"
CONFIDENCE_THRESHOLD = 0.1
DIST_THRESHOLD = 20
ID_AGE_THRESHOLD = 0
LINE = ((0, 350), (960, 370))
DEVICE_ID = 1
SERVER_URL = "http://localhost:3000"
SENDING_FREQ = 10

# Initializing the model
ie = IECore()
net = ie.read_network(model=MODEL_LOCATION)
input_name = next(iter(net.input_info))
exec_net = ie.load_network(network=MODEL_LOCATION, device_name="CPU")  # MYRIAD

# Taking model parameters
N, C, H, W = net.input_info[input_name].tensor_desc.dims

#Starting video capture
cap = cv2.VideoCapture(VIDEO_SOURCE)

# Previous frame points, age of IDs and set of ID counted as entered
perv_people = []  # [[id, (x,y)]]
id_age = dict()  # {id -> frames since first detection}
entered = set()

# ID generation
next_id_val = 0


def next_id():
    global next_id_val
    id = next_id_val
    id_age[id] = 0
    next_id_val += 1
    return id


# Thread resetting the counter every midnight
def reset_count():
    global entered
    while True:
        now = datetime.datetime.today()
        reset_time = datetime.datetime(now.year, now.month, now.day, 0, 0)
        reset_time += datetime.timedelta(days=1)
        time.sleep((reset_time - now).total_seconds())
        entered = set()


# Thread regularly sending updates to the server
def send():
    while True:
        time.sleep(SENDING_FREQ)

        payload = {
            "date": time.strftime('%Y-%m-%d', time.localtime()),
            "visitors": len(entered)
        }
        try:
            requests.post(SERVER_URL + "/api/stat?id=" + str(DEVICE_ID), json=payload)
        except:
            pass


#starting the threads
resetting_thread = threading.Thread(target=reset_count)
resetting_thread.daemon = True
resetting_thread.start()

sending_thread = threading.Thread(target=send)
sending_thread.daemon = True
sending_thread.start()


# Main loop
while True:
    success, frame = cap.read()

    if success:
        h_orig, w_orig, _ = frame.shape
        # reshaping
        resized_frame = cv2.resize(frame, (H, W))
        input_data = np.expand_dims(np.transpose(resized_frame, (2, 0, 1)), 0)
        # running the detector and filtering the result by confidence
        result = exec_net.infer({input_name: input_data})
        output = result['detection_out']
        datarows = output[0][0]
        datarows = datarows[~np.all(datarows == 0, axis=1)]
        datarows = datarows[datarows[:, 2] > CONFIDENCE_THRESHOLD]

        current_people = []
        # finding the center for every person
        for row in datarows:
            top_left_x_float = row[3]
            top_left_y_float = row[4]
            bottom_right_x_float = row[5]
            bottom_right_y_float = row[6]

            current_point_x_float = (top_left_x_float + bottom_right_x_float)/2
            current_point_y_float = (top_left_y_float + bottom_right_y_float)/2

            current_point_x = int(current_point_x_float * w_orig)
            current_point_y = int(current_point_y_float * h_orig)

            current_people.append([-1, (current_point_x, current_point_y)])

        # finding correspondence between two frames
        for id, (x, y) in perv_people:
            closest_dist = float("inf")
            closest_i = -1
            for i, [id_c, (x_c, y_c)] in enumerate(current_people):
                if id_c != -1:
                    continue
                dist_squared = (x-x_c)**2 + (y-y_c)**2
                if dist_squared < closest_dist and dist_squared < DIST_THRESHOLD**2:
                    closest_dist = dist_squared
                    closest_i = i
            if closest_i != -1:
                current_people[closest_i][0] = id
                id_age[id] += 1
                k = (LINE[1][1] - LINE[0][1]) / (LINE[1][0] - LINE[0][0])
                b = LINE[0][1] - k * LINE[0][0]
                y_curr = current_people[closest_i][1][1]
                x_curr = current_people[closest_i][1][0]
                if id_age[id] > ID_AGE_THRESHOLD and y < (k*x+b) and y_curr > (k*x_curr+b):
                    entered.add(id)
            else:
                del id_age[id]
        # new people get new IDs
        for i in range(len(current_people)):
            if current_people[i][0] == -1:
                current_people[i][0] = next_id()
        # new frame points are now previous frame points
        perv_people = current_people

        # show the image (debug only)
        if SHOW_IMG:
            for id, coords in current_people:
                cv2.putText(frame, str(id), coords, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, str(len(entered)), (int(0.9*w_orig), int(0.1*h_orig)), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
            cv2.line(frame, *LINE, (255, 0, 0), 2)
            cv2.imshow("Frame", frame)

        key = cv2.waitKey(10)
        if key == ord('q'):
            break
    else:
        break


sys.exit()

