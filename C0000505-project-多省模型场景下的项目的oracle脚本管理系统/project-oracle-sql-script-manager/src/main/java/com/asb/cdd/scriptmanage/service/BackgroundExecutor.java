package com.asb.cdd.scriptmanage.service;

public interface BackgroundExecutor {

	public void init();
	
	public boolean isTurnOn();
	public void setTurnOn(boolean turnOn);
	public boolean isRunning();
}
