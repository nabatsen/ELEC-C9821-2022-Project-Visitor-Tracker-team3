# DTAP_team3

# Project: Visitor Tracker

Visitor tracking for exhibition space(s) in Aalto University

# Design concept

Problem: hosts want to know how many people visit their exhibition. In addition, they would also like to collect more fine-grained data to understand which parts of the exhibition are the most popular and how visitor numbers change with time

Typical Solution: curators keeping track of visitors behavior while leading the excursions / observing the exhibition and analyzing the data by themselves

Our Solution: build the system consisting of device keeping track of people’s movements around the exhibition, backend storing and analyzing the data, and web interface to display the results to the user

# Visualization 

For the visualization and GUI we are using Figma design tool.

## Figma

Initial visualization (mobile application): https://www.figma.com/file/19O2tZ73DjdWIlp6itdmEn/Untitled?node-id=0%3A1

Final visualization (website): https://www.figma.com/file/tmM3bv87e8H2c6MS71wNoO/Exhibition-Tracking-figma?node-id=4%3A17

### UML 

UML (for website and mobile application): https://miro.com/app/board/uXjVO_Sse6c=/?invite_link_id=739179638164

# Technologies

We are using computer vision technologies (OpenVINO framework) to capture and process the video data, Node JS for web server and vanilla Javascript for the web application.

## Run the application

# First, start the back-end server

```
cd dtap_team3/statAPI
npm run dev
```

To run the counter app, you should have OpenVINO runtime installed. Run it as
```
cd dtap_team3/Raspberrypi
python3 counter.py
```

The web app is not hosted by a web server now, but can be opened locally by making the browser open GUI/index.html .
