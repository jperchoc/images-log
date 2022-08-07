# Images logger
Fetches images from greenhouse camera at fixed interval and saves them in a folder.

Install:
- `npm install`
- `HOURS=0 MINUTES=30 SECONDS=0 LIGHT_THRESHOLD=50 API_URL=http://x.x.x.x:xxxx npm start`

With Docker:
- `sudo docker build -t "jperchoc/images-log" .`
-  ``` 
    sudo docker run -d -t -i \
    -e HOURS='0' \
    -e MINUTES='30' \
    -e SECONDS='0'  \
    -e LIGHT_THRESHOLD='50'  \
    -e API_URL='http://x.x.x.x:xxxx'  \
    -v /home/user/images/:/usr/src/app/images  \
    jperchoc/images-log
    ```
