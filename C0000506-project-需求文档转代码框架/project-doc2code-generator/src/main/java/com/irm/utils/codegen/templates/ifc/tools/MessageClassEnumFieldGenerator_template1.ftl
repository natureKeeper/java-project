package ${serverPackagePath};

import common.enums.EnumUtil;
import common.enums.OptionedEnum;

public enum ${enumClassName}Type implements OptionedEnum {

	UNKNOWN((short) 0, ""),
	<#assign keys = dictKeyIfcCodePairs.keySet()>
	<#list keys as key>
	${dictKeyIfcCodePairs.get(key)?upper_case}((short) ${key}, "${dictKeyIfcCodePairs.get(key)}"),//${dictKeyIfcDescPairs.get(key)}
	</#list>
	
	private short value;
	
	private String text;

	private ${enumClassName}Type(short value,String text) {
		this.value = value;
		this.text = text;
	}

	public static ${enumClassName}Type get(short value) {
		return EnumUtil.get(${enumClassName}Type.class, value, UNKNOWN);
	}

	public static ${enumClassName}Type get(String name) {
		return EnumUtil.getByText(${enumClassName}Type.class, name, UNKNOWN);
	}

	public String getText() {
		return this.text;
	}

	public String getName() {
		return name();
	}

	public short getValue() {
		return value;
	}
	
	@Override
	public String toString() {
		return this.text;
	}

}
