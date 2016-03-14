package ${serverPackagePath};

import javax.xml.bind.annotation.adapters.XmlAdapter;


public class ${enumClassName}TypeAdapter extends XmlAdapter<String, ${enumClassName}Type> {
	@Override
	public String marshal(${enumClassName}Type arg0) throws Exception {
		return arg0.getText();
	}
	@Override
	public ${enumClassName}Type unmarshal(String arg0) throws Exception {
		return ${enumClassName}Type.get(arg0);
	}
}
