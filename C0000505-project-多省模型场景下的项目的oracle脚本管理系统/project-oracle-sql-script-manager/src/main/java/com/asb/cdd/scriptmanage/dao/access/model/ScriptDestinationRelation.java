package com.asb.cdd.scriptmanage.dao.access.model;

import com.irm.model.system.SystemModel;

public class ScriptDestinationRelation extends SystemModel {
	/*
	private int id;
	private int version;*/
	private long scriptId;
	private long destinationId;
	
	private Script script;
	private Destination destination;
	public long getScriptId() {
		return scriptId;
	}
	public void setScriptId(long scriptId) {
		this.scriptId = scriptId;
	}
	public long getDestinationId() {
		return destinationId;
	}
	public void setDestinationId(long destinationId) {
		this.destinationId = destinationId;
	}
	public Script getScript() {
		return script;
	}
	public void setScript(Script script) {
		this.script = script;
	}
	public Destination getDestination() {
		return destination;
	}
	public void setDestination(Destination destination) {
		this.destination = destination;
	}


}
