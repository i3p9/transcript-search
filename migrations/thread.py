import json
import requests
import threading

DELAY = 5.0  # Time between calls in seconds.


def call_API(event):
    iss_data = requests.get("https://transcript-search.onrender.com/health")
    response = iss_data.json()
    print(json.dumps(response, indent=4))  # Do something with results...
    event.set()  # Signal call has been made.


print("Running")
event = threading.Event()
while True:
    event.clear()
    timer = threading.Timer(DELAY, call_API, (event,))  # Call after delay.
    timer.start()
    event.wait()  # Blocks until event is set by another thread.
