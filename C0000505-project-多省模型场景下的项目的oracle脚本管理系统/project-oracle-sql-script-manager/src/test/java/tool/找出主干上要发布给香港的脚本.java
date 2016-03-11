package tool;

import java.util.ArrayList;
import java.util.List;

/**
 * 香港版本用主干脚本，临时生成执行序列
 * 先查sql
 * --主干执行成功，要发香港的脚本，按执行时间排序，记得修改里面的to_date
(SELECT s.EXEC_SEQ exec_seq, 
'copy ' || s.script_location || ' E:\tmp\hk-scripts\' || s.exec_seq || '-' || s.NAME bat脚本, 
'list.add("' || exec_seq || '-' || s.NAME || '");' java代码,
se.LATEST_EXEC_TIME,e.NAME,
1 seq
FROM t_script s, R_SCRIPT_ENVIRONMENT se, T_ENVIRONMENT e
WHERE e.code='TRUNK_CMI'
AND se.STATUS=4
AND s.status != 10
AND se.ENVIRONMENT_ID=e.ID
AND s.ID=se.SCRIPT_ID
AND se.LATEST_EXEC_TIME > to_date('2015-01-20','yyyy-mm-dd')
and s.exec_seq > 0)
union
((SELECT s.EXEC_SEQ exec_seq, 
'copy ' || s.script_location || ' E:\tmp\hk-scripts\' || s.exec_seq || '-' || s.NAME bat脚本, 
'list.add("' || exec_seq || '-' || s.NAME || '");' java代码,
se.LATEST_EXEC_TIME,e.NAME,
2 seq
FROM t_script s, R_SCRIPT_ENVIRONMENT se, T_ENVIRONMENT e
WHERE e.code='TRUNK_CMI'
AND se.STATUS=4
AND s.status != 10
AND se.ENVIRONMENT_ID=e.ID
AND s.ID=se.SCRIPT_ID
AND se.LATEST_EXEC_TIME > to_date('2015-01-20','yyyy-mm-dd')
and s.exec_seq = 0))
ORDER BY seq, EXEC_SEQ;
 *
 */
public class 找出主干上要发布给香港的脚本 
{
    public static void main( String[] args ) throws Exception
    {
    	System.out.println("--开始");
    	for (String str : list) {
    		print(str);
    	}
    	System.out.println("--结束");
    }
    
    public static void print(String filename) {    	
    	System.out.print("prompt 'begin " + filename + ";'\r\n");
    	System.out.print("column scriptname noprint new_value scriptname;\r\n");
    	System.out.print("select decode(count(1),0,'" + "@d:\\hk\\cmi-20141218" + "\\" + filename + "','该脚本已经执行了 " + filename + "') as scriptname From db_scriptPatch where Scriptname = '" + filename + "' and endTime is not null;\r\n");
    	System.out.print("insert into db_scriptPatch (id, Scriptname, startTime) select seq_db_scriptPatch.Nextval, '" + filename + "', sysdate from dual where not exists (select * From db_scriptPatch where Scriptname = '" + filename + "' and endTime is not null);\r\n");
    	System.out.print("commit;\r\n");
    	System.out.print("prompt 'exec' &&scriptname;\r\n");
    	System.out.print("@&&scriptname;\r\n");
    	System.out.print("update db_scriptPatch set endTime=sysdate where id=(select max(id) from db_scriptPatch);\r\n");
    	System.out.print("commit;\r\n");
    	System.out.print("prompt 'end " + filename + ";'\r\n\r\n");
    }
    
    static List<String> list = new ArrayList<String>();
    static {
    	//list.add
    	
    	list.add("1421731612396-CMI-178-DML-taskSeq41179-zhangtianying-script-1.sql");
    	list.add("1421738722057-CMI-193-DML-taskSeq41196-zhangtianying-script-1.sql");
    	list.add("1421808667145-IRM-31962-DML-taskSeq41276-lizhongnan-script-1.sql");
    	list.add("1421815628410-CMI-162-DML-taskSeq41296-lizhongnan-script-1.sql");
    	list.add("1421816364232-CMI-162-DDL-taskSeq41298-chenhonghui-script-1.sql");
    	list.add("1421817677633-IRM-31965-DML-taskSeq41299-zhangtianying-script-1.sql");
    	list.add("1421822985246-CMI-162-DDL-taskSeq41317-chenhonghui-script-1.sql");
    	list.add("1421825391654-IRM-31967-DML-taskSeq41326-chenhonghui-script-1.sql");
    	list.add("1421825952055-CMI-198-DML-taskSeq41327-zhangtianying-script-1.sql");
    	list.add("1421829122864-IRM-31969-DDL-taskSeq41356-zhangtianying-script-1.sql");
    	list.add("1421856193298-IRM-31969-DML-taskSeq41367-zhangtianying-script-1.sql");
    	list.add("1421895345105-IRM-31962-DML-taskSeq41397-lizhongnan-script-1.sql");
    	list.add("1421905443432-CMI-201-DML-taskSeq41436-dingjiaqiang-script-1.sql");
    	list.add("1421912833876-IRM-30869-DML-taskSeq41479-lizhongnan-script-1.sql");
    	list.add("1421913940302-IRM-32007-DDL-taskSeq41486-zhangtianying-script-1.sql");
    	list.add("1421979577424-IRM-31968-DML-taskSeq41536-wusuirong-script-1.sql");
    	list.add("1422000978829-IRM-32036-PROC-taskSeq41596-luqingyun-script-1.sql");
    	list.add("1422240509437-IRM-31983-DML-taskSeq41616-zhangtianying-script-1.sql");
    	list.add("1422257313927-IRM-31925-DML-taskSeq41642-dingjiaqiang-script-1.sql");
    	list.add("1422257885553-IRM-31463-PROC-taskSeq41659-shanyubin-script-1.sql");
    	list.add("1422257990512-CMI-209-DML-taskSeq41633-zhangtianying-script-1.sql");
    	list.add("1422257992700-CMI-209-DML-taskSeq41636-zhangtianying-script-1.sql");
    	list.add("1422260296018-CMI-212-DML-taskSeq41666-dingjiaqiang-script-1.sql");
    	list.add("1422261970604-CMI-208-DML-taskSeq41638-zhangtianying-script-1.sql");
    	list.add("1422323811893-IRM-32045-DDL-taskSeq41696-zhangtianying-script-1.sql");
    	list.add("1422323999707-IRM-32051-DDL-taskSeq41697-zhangtianying-script-1.sql");
    	list.add("1422336636347-IRM-32082-DML-taskSeq41726-zhangtianying-script-1.sql");
    	list.add("1422337769161-IRM-32086-DDL-taskSeq41746-zhangtianying-script-1.sql");
    	list.add("1422341898333-IRM-32084-DML-taskSeq41767-dingjiaqiang-script-1.sql");
    	list.add("1422347856273-CMI-216-DDL-taskSeq41787-zhangtianying-script-1.sql");
    	list.add("1422347857379-CMI-216-DML-taskSeq41787-zhangtianying-script-2.sql");
    	list.add("1422347876747-CMI-216-PROC-taskSeq41787-zhangtianying-script-3.sql");
    	list.add("1422347878451-CMI-216-DML-taskSeq41787-zhangtianying-script-4.sql");
    	list.add("1422347943805-CMI-217-DML-taskSeq41796-zhangtianying-script-1.sql");
    	list.add("1422374564606-IRM-32045-DML-taskSeq41736-zhangtianying-script-1.sql");
    	list.add("1422374738936-IRM-32051-DML-taskSeq41737-zhangtianying-script-1.sql");
    	list.add("1422410616382-CMI-218-DDL-taskSeq41856-zhangtianying-script-1.sql");
    	list.add("1422410617623-CMI-218-PROC-taskSeq41856-zhangtianying-script-2.sql");
    	list.add("1422411365611-CMI-220-PROC-taskSeq41857-zhangtianying-script-1.sql");
    	list.add("1422411522602-CMI-222-DML-taskSeq41826-dingjiaqiang-script-1.sql");
    	list.add("1422413434950-CMI-219-DML-taskSeq41876-zhangtianying-script-1.sql");
    	list.add("1422414396606-CMI-226-DDL-taskSeq41880-zhangtianying-script-1.sql");
    	list.add("1422414442047-CMI-226-DML-taskSeq41880-zhangtianying-script-2.sql");
    	list.add("1422414541261-CMI-226-DML-taskSeq41880-zhangtianying-script-3.sql");
    	list.add("1422421844696-CMI-231-DML-taskSeq41899-chenhonghui-script-1.sql");
    	list.add("1422422219236-CMI-231-DML-taskSeq41900-chenhonghui-script-1.sql");
    	list.add("1422426269359-CMI-231-DML-taskSeq41904-dingjiaqiang-script-1.sql");
    	list.add("1422426369445-CMI-227-DML-taskSeq41905-dingjiaqiang-script-1.sql");
    	list.add("1422426382261-CMI-219-DML-taskSeq41911-dingjiaqiang-script-1.sql");
    	list.add("1422426610319-CMI-231-DML-taskSeq41916-dingjiaqiang-script-1.sql");
    	list.add("1422431888721-IRM-32062-DDL-taskSeq41936-chenhonghui-script-1.sql");
    	list.add("1422499368170-CMI-232-PROC-taskSeq41980-zhangtianying-script-1.sql");
    	list.add("1422505848339-CMI-233-DML-taskSeq41996-zhangtianying-script-1.sql");
    	list.add("1422510489136-IRM-31935-DDL-taskSeq42026-zhangtianying-script-1.sql");
    	list.add("1422600467007-IRM-32161-PROC-taskSeq42096-zhangtianying-script-1.sql");
    	list.add("1422848386328-IRM-32177-DDL-taskSeq42186-zhangtianying-script-1.sql");
    	list.add("1422856876189-IRM-32194-DML-taskSeq42236-huangning-script-1.sql");
    	list.add("1422856889422-IRM-32194-PROC-taskSeq42236-huangning-script-2.sql");
    	list.add("1422927889703-IRM-32177-DDL-taskSeq42296-zhangtianying-script-1.sql");
    	list.add("1422927995176-IRM-32177-DML-taskSeq42296-zhangtianying-script-2.sql");
    	list.add("1422928079002-IRM-32177-PROC-taskSeq42296-zhangtianying-script-3.sql");
    	list.add("1422942971816-IRM-32177-DDL-taskSeq42346-zhangtianying-script-1.sql");
    	list.add("1422945625872-IRM-32247-DDL-taskSeq42356-zhangtianying-script-1.sql");
    	list.add("1422949727830-IRM-32247-DML-taskSeq42356-zhangtianying-script-2.sql");
    	list.add("1422949905931-IRM-32247-DML-taskSeq42356-zhangtianying-script-3.sql");
    	list.add("1422951068651-IRM-32234-DML-taskSeq42376-zhangtianying-script-1.sql");
    	list.add("1422955703400-IRM-31951-DML-taskSeq42397-zhangtianying-script-1.sql");
    	list.add("1422979254380-IRM-32177-DML-taskSeq42391-zhangtianying-script-1.sql");
    	list.add("1422979427417-IRM-32177-DML-taskSeq42391-zhangtianying-script-2.sql");
    	list.add("1423017294535-IRM-31951-DML-taskSeq42436-dingjiaqiang-script-1.sql");
    	list.add("1423034052856-IRM-32284-DDL-taskSeq42506-chenhonghui-script-1.sql");
    	list.add("1423037481852-IRM-32291-DML-taskSeq42516-huangning-script-1.sql");
    	list.add("1423105113028-IRM-31935-PROC-taskSeq42026-zhangtianying-script-2.sql");
    	list.add("1423107982146-IRM-32305-PROC-taskSeq42557-huangning-script-1.sql");
    	list.add("1423108196888-IRM-32308-DDL-taskSeq42566-wusuirong-script-1.sql");
    	list.add("1423121825948-IRM-32305-PROC-taskSeq42581-huangning-script-1.sql");
    	list.add("1423136163564-IRM-32310-DDL-taskSeq42628-zhangtianying-script-1.sql");
    	list.add("1423136320738-IRM-32310-DML-taskSeq42628-zhangtianying-script-2.sql");
    	list.add("1423136438363-IRM-32310-DML-taskSeq42628-zhangtianying-script-3.sql");
    	list.add("1423192361507-IRM-32207-PROC-taskSeq42696-huangning-script-1.sql");
    	list.add("1423192378819-IRM-32207-PROC-taskSeq42696-huangning-script-2.sql");
    	list.add("1423200586489-IRM-32338-DDL-taskSeq42746-zhangtianying-script-1.sql");
    	list.add("1423200602010-IRM-32338-DML-taskSeq42746-zhangtianying-script-2.sql");
    	list.add("1423205165270-IRM-32259-DML-taskSeq42767-lizhongnan-script-1.sql");
    	list.add("1423206139685-IRM-32334-DDL-taskSeq42766-zhangtianying-script-1.sql");
    	list.add("1423206217112-IRM-32334-DML-taskSeq42766-zhangtianying-script-2.sql");
    	list.add("1423213281852-IRM-32382-DDL-taskSeq42806-zhangtianying-script-1.sql");
    	list.add("1423213326412-IRM-32382-DML-taskSeq42806-zhangtianying-script-2.sql");
    	list.add("1423457450988-IRM-32402-DDL-taskSeq42856-zhangtianying-script-1.sql");
    	list.add("1423457469624-IRM-32402-DML-taskSeq42856-zhangtianying-script-2.sql");
    	list.add("1423458968366-IRM-32354-DDL-taskSeq42858-zhangtianying-script-1.sql");
    	list.add("1423458985146-IRM-32354-DML-taskSeq42858-zhangtianying-script-2.sql");
    	list.add("1423461978135-IRM-32345-DDL-taskSeq42876-zhangtianying-script-1.sql");
    	list.add("1423461983296-IRM-32345-DML-taskSeq42876-zhangtianying-script-2.sql");
    	list.add("1423537447545-CMI-253-DML-taskSeq42986-dingjiaqiang-script-1.sql");
    	list.add("1423547683349-IRM-32448-DML-taskSeq43017-fanpeng-script-1.sql");
    	list.add("1423558208868-IRM-32456-DDL-taskSeq43048-zhangtianying-script-1.sql");
    	list.add("1423558297664-IRM-32456-DML-taskSeq43048-zhangtianying-script-2.sql");
    	list.add("1423558389714-IRM-32456-PROC-taskSeq43048-zhangtianying-script-3.sql");
    	list.add("1423558596089-IRM-32456-DDL-taskSeq43049-zhangtianying-script-1.sql");
    	list.add("1423558675277-IRM-32456-DML-taskSeq43049-zhangtianying-script-2.sql");
    	list.add("1423558736595-IRM-32456-DML-taskSeq43049-zhangtianying-script-3.sql");
    	list.add("1423626097151-CMI-235-PROC-taskSeq43136-zhangtianying-script-1.sql");
    	list.add("1423634340891-IRM-32023-DDL-taskSeq41966-zhangtianying-script-1.sql");
    	list.add("1423634341883-IRM-32023-DML-taskSeq41976-zhangtianying-script-1.sql");
    	list.add("1423641381433-IRM-32476-DDL-taskSeq43186-zhangtianying-script-1.sql");
    	list.add("1423641455487-IRM-32476-DML-taskSeq43186-zhangtianying-script-2.sql");
    	list.add("1423641517061-IRM-32476-DML-taskSeq43186-zhangtianying-script-3.sql");
    	list.add("1423706130062-IRM-31990-DDL-taskSeq41567-zhangtianying-script-1.sql");
    	list.add("1423706155233-IRM-31990-DML-taskSeq41597-zhangtianying-script-1.sql");
    	list.add("1423706181116-IRM-31990-DML-taskSeq41597-zhangtianying-script-2.sql");
    	list.add("1423706242275-IRM-31990-PROC-taskSeq41597-zhangtianying-script-3.sql");
    	list.add("1423706243514-IRM-31990-DML-taskSeq41597-zhangtianying-script-4.sql");
    	list.add("1423706245510-IRM-31990-DML-taskSeq42548-zhangtianying-script-1.sql");
    	list.add("1423731486515-CMI-232-DML-taskSeq43346-dingjiaqiang-script-1.sql");
    	list.add("1423731706616-IRM-32301-DDL-taskSeq42706-zhangtianying-script-1.sql");
    	list.add("1423731707448-IRM-32301-DML-taskSeq42706-zhangtianying-script-2.sql");
    	list.add("1423731732323-IRM-32301-PROC-taskSeq42706-zhangtianying-script-3.sql");
    	list.add("1423733419573-IRM-32336-DML-taskSeq43368-dingjiaqiang-script-1.sql");
    	list.add("1423749392941-IRM-32468-DDL-taskSeq43386-chenhonghui-script-1.sql");
    	list.add("1423749407023-IRM-32468-DDL-taskSeq43386-chenhonghui-script-2.sql");
    	list.add("1423749423892-IRM-32468-DDL-taskSeq43386-chenhonghui-script-3.sql");
    	list.add("1423794948006-CMI-267-DML-taskSeq43402-zhaoqiang-script-1.sql");
    	list.add("1423796666560-IRM-32530-PROC-taskSeq43403-qiaolianjun-script-1.sql");
    	list.add("1423797059377-CMI-260-DDL-taskSeq43407-zhangtianying-script-1.sql");
    	list.add("1423797062723-CMI-260-DDL-taskSeq43407-zhangtianying-script-2.sql");
    	list.add("1423797460790-CMI-260-DML-taskSeq43407-zhangtianying-script-1.sql");
    	list.add("1423797496120-CMI-260-DML-taskSeq43407-zhangtianying-script-2.sql");
    	list.add("1423797629366-CMI-260-PROC-taskSeq43407-zhangtianying-script-3.sql");
    	list.add("1423798615426-CMI-261-DML-taskSeq43407-zhangtianying-script-1.sql");
    	list.add("1423803727910-IRM-32521-DDL-taskSeq43416-zhangtianying-script-1.sql");
    	list.add("1423803735539-IRM-32521-DML-taskSeq43416-zhangtianying-script-2.sql");
    	list.add("1423816152072-IRM-32456-DDL-taskSeq43468-zhangtianying-script-1.sql");
    	list.add("1423816220483-IRM-32456-DML-taskSeq43468-zhangtianying-script-2.sql");
    	list.add("1423816296804-IRM-32456-DML-taskSeq43468-zhangtianying-script-3.sql");
    	list.add("1423817540924-CMI-278-DML-taskSeq43486-liye-script-1.sql");
    	list.add("1423817542179-CMI-278-DML-taskSeq43486-liye-script-2.sql");
    	list.add("1423843306844-CMI-260-DML-taskSeq43436-zhangtianying-script-1.sql");
    	list.add("1423843416436-CMI-260-DML-taskSeq43472-zhangtianying-script-1.sql");
    	list.add("1423964587590-CMI-277-DDL-taskSeq43496-wangbing-script-1.sql");
    	list.add("1423964785509-CMI-277-DML-taskSeq43497-wangbing-script-1.sql");
    	list.add("1423977744807-CMI-250-DDL-taskSeq43506-liwei-script-1.sql");
    	list.add("1423984939654-CMI-250-PROC-taskSeq43517-liwei-script-1.sql");
    	list.add("1423985943205-CMI-250-DML-taskSeq43518-zhaoqiang-script-1.sql");
    	list.add("1423985944823-CMI-250-DML-taskSeq43518-zhaoqiang-script-2.sql");
    	list.add("1424073324602-CMI-260-DDL-taskSeq43556-zhangtianying-script-1.sql");
    	list.add("1424073326024-CMI-260-DML-taskSeq43556-zhangtianying-script-2.sql");
    	list.add("1424141162734-IRM-32535-DDL-taskSeq43569-zhangtianying-script-1.sql");
    	list.add("1424842063600-CMI-262-DML-taskSeq43573-wangxiangyang-script-1.sql");
    	list.add("1424849828204-CMI-262-DML-taskSeq43601-wangxiangyang-script-1.sql");
    	list.add("1424850234783-CMI-262-DML-taskSeq43603-wangxiangyang-script-1.sql");
    	list.add("1424852228450-CMI-262-DML-taskSeq43621-wangxiangyang-script-1.sql");
    	list.add("1424853223048-CMI-262-DML-taskSeq43631-wangxiangyang-script-1.sql");
    	list.add("1424856393942-CMI-262-DML-taskSeq43632-wangxiangyang-script-1.sql");
    	list.add("1424868460136-CMI-265-DML-taskSeq43651-qianlijie-script-1.sql");
    	list.add("1424918480155-CMI-281-DML-taskSeq43665-zhaoqiang-script-1.sql");
    	list.add("1424918690975-IRM-32575-DDL-taskSeq43671-zhangtianying-script-1.sql");
    	list.add("1424918775848-IRM-32575-DML-taskSeq43671-zhangtianying-script-2.sql");
    	list.add("1424919678365-IRM-32570-DDL-taskSeq43566-zhangtianying-script-1.sql");
    	list.add("1424919679405-IRM-32570-DML-taskSeq43566-zhangtianying-script-2.sql");
    	list.add("1424934135594-CMI-260-DML-taskSeq43702-zhangtianying-script-1.sql");
    	list.add("1424941131657-CMI-262-DML-taskSeq43722-dingjiaqiang-script-1.sql");
    	list.add("1424941742766-CMI-262-DML-taskSeq43724-dingjiaqiang-script-1.sql");
    	list.add("1424943908019-CMI-262-DML-taskSeq43724-dingjiaqiang-script-2.sql");
    	list.add("1424943961964-CMI-262-DML-taskSeq43724-dingjiaqiang-script-3.sql");
    	list.add("1424943969720-CMI-262-DML-taskSeq43724-dingjiaqiang-script-4.sql");
    	list.add("1424943977124-CMI-262-DML-taskSeq43724-dingjiaqiang-script-5.sql");
    	list.add("1424946580716-CMI-262-DML-taskSeq43731-dingjiaqiang-script-1.sql");
    	list.add("1424950985210-CMI-262-DML-taskSeq43732-dingjiaqiang-script-1.sql");
    	list.add("1424951786528-CMI-262-DML-taskSeq43733-dingjiaqiang-script-1.sql");
    	list.add("1424952790486-CMI-271-DML-taskSeq43735-dingjiaqiang-script-1.sql");
    	list.add("1424953192201-CMI-271-DML-taskSeq43736-dingjiaqiang-script-1.sql");
    	list.add("1425006918937-CMI-258-PROC-taskSeq43753-zhangpeiyun-script-1.sql");
    	list.add("0-CMI-180-DML-taskSeq41058-zhangtianying-script-2.sql");
    	list.add("0-CMI-145-DML-taskSeq41187-dingjiaqiang-script-1.sql");
    	list.add("0-CMI-175-DML-taskSeq41177-zhangtianying-script-1.sql");
    	list.add("0-CMI-175-DML-taskSeq41206-dingjiaqiang-script-1.sql");
    	list.add("0-CMI-187-DML-taskSeq41181-dingjiaqiang-script-1.sql");
    	list.add("0-CMI-194-DML-taskSeq41216-zhangtianying-script-1.sql");
    	list.add("0-CMI-195-DML-taskSeq41272-dingjiaqiang-script-1.sql");
    	list.add("0-CMI-203-DML-taskSeq41496-zhangtianying-script-1.sql");
    	list.add("0-IRM-31925-DML-taskSeq41630-dingjiaqiang-script-1.sql");
    	list.add("0-IRM-32071-DDL-taskSeq41716-zhangtianying-script-1.sql");
    	list.add("0-IRM-32071-DML-taskSeq41716-zhangtianying-script-2.sql");
    	list.add("0-CMI-128-DML-taskSeq41929-lijunheng-script-1.sql");
    	list.add("0-IRM-32071-DML-taskSeq42176-liuguangfu-script-1.sql");
    	list.add("0-IRM-32397-DDL-taskSeq42886-zhangtianying-script-1.sql");
    	list.add("0-IRM-32397-DML-taskSeq42886-zhangtianying-script-2.sql");
    	list.add("0-IRM-32409-DDL-taskSeq43096-zhangtianying-script-1.sql");
    	list.add("0-IRM-32409-DML-taskSeq43096-zhangtianying-script-2.sql");
    	list.add("0-CMI-246-DML-taskSeq43296-liuguangfu-script-1.sql");
    	list.add("0-CMI-246-DML-taskSeq43338-liuguangfu-script-1.sql");
    	list.add("0-CMI-268-DDL-taskSeq43356-zhangtianying-script-1.sql");
    	list.add("0-CMI-268-DML-taskSeq43356-zhangtianying-script-1.sql");
    	list.add("0-IRM-32454-DDL-taskSeq43366-zhangtianying-script-1.sql");
    	list.add("0-IRM-32454-DML-taskSeq43366-zhangtianying-script-1.sql");
    	list.add("0-IRM-32454-DML-taskSeq43366-zhangtianying-script-2.sql");
    	list.add("0-IRM-32454-DML-taskSeq43366-zhangtianying-script-4.sql");
    	list.add("0-IRM-32454-PROC-taskSeq43366-zhangtianying-script-3.sql");
    	list.add("0-IRM-32465-DDL-taskSeq43367-zhangtianying-script-1.sql");
    	list.add("0-IRM-32465-DML-taskSeq43367-zhangtianying-script-1.sql");
    	list.add("0-IRM-32465-DML-taskSeq43367-zhangtianying-script-2.sql");
    	list.add("0-IRM-32465-DML-taskSeq43367-zhangtianying-script-4.sql");
    	list.add("0-IRM-32465-PROC-taskSeq43367-zhangtianying-script-3.sql");
    	list.add("0-CMI-235-PROC-taskSeq43489-zhangtianying-script-1.sql");
    	list.add("0-CMI-246-DML-taskSeq43406-liuguangfu-script-1.sql");
    	list.add("0-CMI-248-DML-taskSeq43467-meijunhui-script-1.sql");
    	list.add("0-CMI-270-DDL-taskSeq43426-zhangtianying-script-1.sql");
    	list.add("0-CMI-270-DML-taskSeq43426-zhangtianying-script-2.sql");
    	list.add("0-CMI-270-DML-taskSeq43426-zhangtianying-script-3.sql");
    	list.add("0-CMI-276-DML-taskSeq43417-liuguangfu-script-1.sql");
    	list.add("0-CMI-261-DML-taskSeq43570-zhangtianying-script-1.sql");
    	list.add("0-CMI-235-PROC-taskSeq43591-zhangtianying-script-1.sql");
    	list.add("0-CMI-235-PROC-taskSeq43611-zhangtianying-script-1.sql");
    	list.add("0-CMI-261-DML-taskSeq43571-zhangtianying-script-1.sql");
    	list.add("0-CMI-263-DML-taskSeq43572-zhangtianying-script-2.sql");
    	list.add("0-CMI-263-PROC-taskSeq43572-zhangtianying-script-1.sql");
    	list.add("0-CMI-263-DML-taskSeq43691-zhangtianying-script-1.sql");
    	list.add("0-CMI-263-DML-taskSeq43701-zhangtianying-script-1.sql");
    	list.add("0-CMI-264-DDL-taskSeq43641-zhangtianying-script-1.sql");
    	list.add("0-CMI-264-PROC-taskSeq43641-zhangtianying-script-2.sql");
    	list.add("0-CMI-264-PROC-taskSeq43681-zhangtianying-script-1.sql");
    	list.add("0-CMI-264-PROC-taskSeq43711-zhangtianying-script-1.sql");
    	list.add("0-CMI-264-PROC-taskSeq43711-zhangtianying-script-2.sql");
    	list.add("0-IRM-32252-DDL-taskSeq43663-zhangtianying-script-1.sql");
    	list.add("0-IRM-32252-DML-taskSeq43712-zhangtianying-script-1.sql");
    	list.add("0-IRM-32252-DML-taskSeq43712-zhangtianying-script-2.sql");
    	list.add("0-IRM-32554-DDL-taskSeq43661-zhangtianying-script-1.sql");
    }
}
