--�Ϻ������·���ȹ�������ftp����
delete sm_preference where code='shanghaiOpticalOrderAttachmentFtpConfig';
insert into sm_preference(id,name,code,memo,enable,type,value,creator,updater)
values(seq_sm_preference.nextval,'�Ϻ������·���ȹ�������ftp����','shanghaiOpticalOrderAttachmentFtpConfig','�Ϻ������·�����д���ϵͳ�ظ�������Ϣʱ���ṩ����',1,'java.lang.String','aaa','wusuirong','wusuirong');