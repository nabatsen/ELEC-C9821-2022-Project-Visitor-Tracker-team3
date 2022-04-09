import cv2
import numpy as np
from openvino.inference_engine import IECore

ie = IECore()

MODEL_LOCATION = "./model/person-detection-0202.xml"
DIST_THRESHOLD = 20
VIDEO_SOURCE = "./MOT20-02-raw.mp4"
#VIDEO_SOURCE = 0
CONFIDENCE_THRESHOLD = 0.1
LINE = ((0, 350), (960, 370))
SHOW_IMG = True

net = ie.read_network(model=MODEL_LOCATION)
input_name = next(iter(net.input_info))
exec_net = ie.load_network(network=MODEL_LOCATION, device_name="CPU")  # MYRIAD

N, C, H, W = net.input_info[input_name].tensor_desc.dims

cap = cv2.VideoCapture(VIDEO_SOURCE)

perv_people = []  # [[id, (x,y)]]
entered = set()


next_id_val = 0


def next_id():
    global next_id_val
    id = next_id_val
    next_id_val += 1
    return id


while True:
    success, frame = cap.read()

    if success:
        h_orig, w_orig, _ = frame.shape

        resized_frame = cv2.resize(frame, (H, W))
        input_data = np.expand_dims(np.transpose(resized_frame, (2, 0, 1)), 0)

        result = exec_net.infer({input_name: input_data})
        output = result['detection_out']
        datarows = output[0][0]
        datarows = datarows[~np.all(datarows == 0, axis=1)]
        datarows = datarows[datarows[:, 2] > CONFIDENCE_THRESHOLD]

        current_people = []

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
                k = (LINE[1][1] - LINE[0][1]) / (LINE[1][0] - LINE[0][0])
                b = LINE[0][1] - k * LINE[0][0]
                y_curr = current_people[closest_i][1][1]
                x_curr = current_people[closest_i][1][0]
                if y < (k*x+b) and y_curr > (k*x_curr+b):
                    entered.add(id)

        for i in range(len(current_people)):
            if current_people[i][0] == -1:
                current_people[i][0] = next_id()

        perv_people = current_people

        if SHOW_IMG:
            for id, coords in current_people:
                cv2.putText(frame, str(id), coords, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(frame, str(len(entered)), (int(0.9*w_orig), int(0.1*h_orig)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            cv2.line(frame, *LINE, (255, 0, 0), 2)
            cv2.imshow("Frame", frame)

        key = cv2.waitKey(10)
        if key == ord('q'):
            break
    else:
        break

