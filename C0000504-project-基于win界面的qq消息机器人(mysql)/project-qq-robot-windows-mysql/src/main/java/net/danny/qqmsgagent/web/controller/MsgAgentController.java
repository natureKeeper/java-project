package net.danny.qqmsgagent.web.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/qqmsgagent")
public class MsgAgentController {

	Logger logger = Logger.getLogger(MsgAgentController.class);

	@RequestMapping("/send")
	@ResponseBody
	public HttpEntity<String> send(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestParam String destination,
			@RequestParam String message) {
		System.out.println("destination: " + destination + ", message: " + message);
		return new ResponseEntity<String>("发送成功", HttpStatus.OK);
	}

}
