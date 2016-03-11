package com.asb.cdd.scriptmanage.service.impl;

import java.util.List;
import java.util.TimerTask;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.asb.cdd.scriptmanage.service.BackgroundExecutor;

public class BackgroundExecutorImpl implements BackgroundExecutor, Runnable {
	
	private static final transient Log log = LogFactory.getLog(BackgroundExecutorImpl.class);

//	private Timer timer;
	private List<TimerTask> tasks;
	
	/**
	 * 以秒为单位
	 */
	private int interval = 10;
	private int delay = 5;
	private boolean turnOn;
	private boolean running;
	
	public void init() {
		interval *= 1000;
		delay *= 1000;
		Thread t = new Thread(this);
		t.start();
	}

	public void run() {
		try {
			Thread.sleep(delay);
		} catch (InterruptedException e) {
			log.error(e, e);
		}
		while (true) {
			if (turnOn) {
				if (null != tasks) {
					for (TimerTask task : tasks) {
						running = true;
						task.run();
					}
				}
			}
			running = false;
			try {
				Thread.sleep(interval);
			} catch (InterruptedException e) {
				log.error(e, e);
			}
		}
	}

	public void setTasks(List<TimerTask> tasks) {
		this.tasks = tasks;
	}

	public int getInterval() {
		return interval;
	}

	public void setInterval(int interval) {
		this.interval = interval;
	}

	public int getDelay() {
		return delay;
	}

	public void setDelay(int delay) {
		this.delay = delay;
	}

	public boolean isTurnOn() {
		return turnOn;
	}

	public void setTurnOn(boolean turnOn) {
		this.turnOn = turnOn;
	}

	public List<TimerTask> getTasks() {
		return tasks;
	}

	public boolean isRunning() {
		return running;
	}

	public void setRunning(boolean running) {
		this.running = running;
	}

	

}
