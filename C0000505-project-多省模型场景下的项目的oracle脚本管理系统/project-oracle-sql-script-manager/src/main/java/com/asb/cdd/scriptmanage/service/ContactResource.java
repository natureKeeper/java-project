package com.asb.cdd.scriptmanage.service;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.asb.cdd.scriptmanage.dao.access.model.Contact;
import com.asb.cdd.scriptmanage.dao.access.model.ContactStore;
import com.asb.cdd.scriptmanage.dao.access.model.IssueDemo;
import com.sun.jersey.api.NotFoundException;

@Path("/contact")
public class ContactResource {
	
	@GET
	@Path("/getContact")  
	@Produces({MediaType.APPLICATION_JSON})
	public Contact getContact(@QueryParam("inContact") String inContact) {
		System.out.println("inContact:"+inContact);
		Contact cont = ContactStore.getStore().get(inContact);
		if(cont==null)
			throw new NotFoundException("No such Contact.");
		return cont;
	}
	
	@POST
	@Path("/getDetailContact")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Contact getDetailContact(Contact c) {
		String id = c.getId();
		Contact cont = ContactStore.getStore().get(id);
		if(cont==null){
			cont = new Contact();
			cont.setName("andy");
		}
			
		return cont;
	}
	
	@GET
	@Path("/getId")
	@Produces(MediaType.TEXT_PLAIN)
	public String getId(@QueryParam("id") String id) {
		System.out.println("id:"+id);
		return id;
	}
	
	@POST
	@Path("/getIssueDemo")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public IssueDemo getIssueDemo(IssueDemo i) {
		i.setIssueId("yes");
		return i;
	}
	
}            
