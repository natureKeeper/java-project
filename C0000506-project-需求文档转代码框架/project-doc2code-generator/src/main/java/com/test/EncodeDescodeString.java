package com.test;

import java.security.Key;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

public class EncodeDescodeString {

	private Key key; // 密钥

	private String encode = "GBK";

	/**
	 * 初始化KEY
	 * 
	 * @param strKey
	 *            密钥字符串
	 */
	public EncodeDescodeString(String strKey) {
		try {
			KeyGenerator generator = KeyGenerator.getInstance("DES");
			generator.init(new SecureRandom(strKey.getBytes()));
			this.key = generator.generateKey();
			generator = null;
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * BASE64加密
	 * 
	 * @param strKey
	 *            密钥字符串
	 */
	public String getBASE64Encoder(String text) {
		byte[] byteText = null;
		String resultStr = "";
		BASE64Encoder base64en = new BASE64Encoder();
		try {
			byteText = text.getBytes(encode);
			resultStr = base64en.encode(get3DESEncCode(byteText));
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			base64en = null;
			byteText = null;
		}
		return resultStr;
	}

	/**
	 * 3DES加密
	 */
	private byte[] get3DESEncCode(byte[] byteS) {
		byte[] byteFina = null;
		Cipher cipher;
		try {
			cipher = Cipher.getInstance("DES");
			cipher.init(Cipher.ENCRYPT_MODE, key);
			byteFina = cipher.doFinal(byteS);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			cipher = null;
		}
		return byteFina;
	}

	/**
	 * 3DES解密
	 */
	private byte[] get3DESDesCode(byte[] byteD) {
		Cipher cipher;
		byte[] byteFina = null;
		try {
			cipher = Cipher.getInstance("DES");
			cipher.init(Cipher.DECRYPT_MODE, key);
			byteFina = cipher.doFinal(byteD);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			cipher = null;
		}
		return byteFina;
	}

	/**
	 * BASE64解密
	 */
	public String getBASE64Descoder(String text) {
		BASE64Decoder base64De = new BASE64Decoder();
		byte[] byteMing = null;
		byte[] byteMi = null;
		String strMing = "";
		try {
			byteMi = base64De.decodeBuffer(text);
			byteMing = get3DESDesCode(byteMi);
			strMing = new String(byteMing, encode);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			base64De = null;
			byteMing = null;
			byteMi = null;
		}
		return strMing;
	}
	
	//解密类
	public static void main(String[] args) throws Exception {
		EncodeDescodeString des = new EncodeDescodeString("abc123");
		String toEnc = des.getBASE64Descoder("XHyHhiGlWsFHrmamjKUWNgbO3H5QyK2bAyVkkdIC8jDNjTixabWnttq7HvJLAKaQLsUrWtSo8OLl/CqWO6yKjaSGVS5uWEGExbnJ0gFPsc53YZfOQcxjodxQ2VtmfNHpo/dthFLBaB1544BIOrqey+b7k2xe27kS69mK+g5w3NfOn3PKkIOXE/Y7ytYs04bcmkeaJaGBnVumf/UlhfH3tHo3ZhY6uSWCQgNzeIq/b4gO1hTIiUax2d0jpQkiNbMWl6RmnY/lLjb+WKq3cq/DvF9o0rEmFncp/XnpSFR/jupRLdbmlOEH6LdM7K7qaS+KTZOiCHqO1ss89xbw9q5uKKPQBSyOrEppCiSDt93LtfCqKiuO1aMYFNb5Bb2Hfrm9/MA2QHg3S/Bd+doL0Fur3A==");
		System.out.println(toEnc);
		/*String key = args[0];
		String path = args[1];
		File file = new File(path);
		String newFilePath=file.getPath();
		newFilePath=newFilePath.substring(0, newFilePath.lastIndexOf("."))+"_jimi.txt";
		File newFile = new File(newFilePath);
		EncodeDescodeString des = new EncodeDescodeString(key);
		BufferedReader reader = new BufferedReader(new FileReader(file));
		BufferedWriter writer = new BufferedWriter(new FileWriter(newFile));
		String contant=null;
		String toEnc =null;
		while(true){
			contant=reader.readLine();
			//已经达到流的结尾
			if(contant==null){
				break;
			}
			//解密
			toEnc= des.getBASE64Descoder(contant);
			writer.write(toEnc);
			writer.newLine();
		}
		reader.close();
		writer.flush();
		writer.close();*/
	}
}