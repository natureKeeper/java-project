package test;

import java.util.Date;

import com.irm.integration.business.eoms.message.StartProjectDesignRequest;
import com.irm.integration.business.eoms.message.StartProjectDesignRequestDetail;

import common.jaxb.JaxbUtil;

public class JavaClassXmlFormatViewer {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		StartProjectDesignRequest req = new StartProjectDesignRequest();
		req.setAcceptTimeLimit(new Date());
		req.setAdjustmentType("测试");
		
		for (int i=0; i<3; i++) {
			StartProjectDesignRequestDetail detail = new StartProjectDesignRequestDetail();
			detail.setaBusiName("子对象属性" + i);
			req.getStartProjectDesignRequestDetailList().add(detail);
		}
		
		String xml = JaxbUtil.objectToXml(req);
		System.out.println(xml);
	}
}
