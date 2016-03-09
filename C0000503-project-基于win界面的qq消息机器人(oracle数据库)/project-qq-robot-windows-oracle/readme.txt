测试post方式，在linux下
curl -d "destination=wusuirong" -d "message=测试信息" http://135.251.23.87:8000/msgproxy/QqProxyServlet
测试get方式，在chrome地址栏输入
http://127.0.0.1:8000/msgproxy/receiveMessageAction.html?destination=wusuirong&message=你好啊