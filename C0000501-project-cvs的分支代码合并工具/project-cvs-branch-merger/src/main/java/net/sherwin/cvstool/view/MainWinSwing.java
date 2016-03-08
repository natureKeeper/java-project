package net.sherwin.cvstool.view;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.EventQueue;
import java.awt.GridLayout;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.InputEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.IOException;

import javax.swing.DefaultListModel;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.ListCellRenderer;
import javax.swing.UIManager;

import net.sherwin.cvstool.model.ModelFacade;
import net.sherwin.cvstool.model.data.DirPair;
import net.sherwin.cvstool.model.data.FileInfo;
import net.sherwin.cvstool.model.data.FileInfoPair;
import net.sherwin.cvstool.model.util.Config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class MainWinSwing extends JFrame {

	    /**
	     * Creates new form AwtUi
	     * @throws Exception 
	     */
	    public MainWinSwing() throws Exception {
	        initComponents();
	        initModel();
	        initAction();
	    }
	    
	    private void initModel() {
	    	listModel1 = new DefaultListModel();
	    	list1.setModel(listModel1);
			listModel2 = new DefaultListModel();
			list2.setModel(listModel2);
	    	model = new ModelFacade();
	    }

	    private void initComponents() throws Exception {
	    	
	    	/*
	    	 * getCrossPlatformLookAndFeelClassName调用通用的外观，适合任何系统。
	    	 * 若使用getSystemLookAndFeelClassName则根据本地的系统使用外观, 如果要指定使用一种外观则带入具体的外观的类的名字。例如，使用GTK＋的外观的代码
	    	 */
	    	UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());

	    	myCellRenderer = new MyCellRenderer();
	        panel1 = new JPanel();
	        panel3 = new JPanel();
	        panel7 = new JPanel();
	        checkbox1 = new JCheckBox();
	        list1 = new JList();
	        
	        
	        
	        panel4 = new JPanel();
	        checkbox2 = new JCheckBox();
	        list2 = new JList();
	        
	        
	        panel2 = new JPanel();
	        panel5 = new JPanel();
	        panel6 = new JPanel();
	        compareBtn = new JButton();
	        copyBtn = new JButton();
	        label1 = new JLabel(NOFILE_PLACEHOLDER);
//	        label1.setAlignment(Label.CENTER);
	        
	        label2 = new JLabel(NOFILE_PLACEHOLDER);
//	        label2.setAlignment(Label.CENTER);
	        
	        statusLabel = new JLabel(NOFILE_PLACEHOLDER);
	        
	        label1.setHorizontalAlignment(JLabel.CENTER);
	        label2.setHorizontalAlignment(JLabel.CENTER);

	        setIconImage(Toolkit.getDefaultToolkit().createImage(ClassLoader.getSystemResource("title.gif")));
	        setTitle("cvs trunk-branch merger alpha by sherwin");
	        

	        panel1.setLayout(new GridLayout(2, 1));

	        panel3.setLayout(new BorderLayout());

	        checkbox1.setText("Locked");
	        
	        list1.setCellRenderer(myCellRenderer);
	        
//	        scroll1.setLayout(new BorderLayout());
	        scroll1 = new JScrollPane(list1);//scroll1.add(list1);
	        
	        panel3.add(checkbox1, BorderLayout.WEST);
	        panel3.add(scroll1, BorderLayout.CENTER);
	        panel3.add(panel5, BorderLayout.SOUTH);
	        
	        panel5.setLayout(new BorderLayout());
	        panel5.add(label1, BorderLayout.CENTER);

	        panel1.add(panel3);

	        panel4.setLayout(new BorderLayout());

	        checkbox2.setText("Locked");
	        
	        list2.setCellRenderer(myCellRenderer);
	        
//	        scroll2.setLayout(new ScrollPaneLayout());
	        scroll2 = new JScrollPane(list2);//scroll2.add(list2);
	        
	        //设置2个滚动条联动
	        scroll1.setHorizontalScrollBar(scroll2.getHorizontalScrollBar());
	        scroll1.setVerticalScrollBar(scroll2.getVerticalScrollBar());
	        
	        panel4.add(checkbox2, BorderLayout.WEST);
	        panel4.add(scroll2, BorderLayout.CENTER);
	        panel4.add(panel6, BorderLayout.SOUTH);
	        
	        panel6.setLayout(new BorderLayout());
	        panel6.add(label2, BorderLayout.CENTER);

	        panel1.add(panel4);

	        add(panel1, BorderLayout.CENTER);

	        compareBtn.setText("Compare");
	        copyBtn.setText("Copy");
	        panel2.setLayout(new GridLayout(2, 1));
	        panel2.add(panel7);
	        panel7.add(compareBtn);
	        panel7.add(copyBtn);
	        panel2.add(statusLabel);

	        add(panel2, BorderLayout.SOUTH);
	        
	        Toolkit kit = Toolkit.getDefaultToolkit();    // 定义工具包
	        Dimension screenSize = kit.getScreenSize();   // 获取屏幕的尺寸
	        setPreferredSize(new Dimension(screenSize.width, screenSize.height-80));

	        pack();
	        
	        //设置居中显示
	        int screenWidth = screenSize.width/2;         // 获取屏幕的宽
	        int screenHeight = screenSize.height/2;       // 获取屏幕的高
	        
	        int height = this.getHeight();
	        int width = this.getWidth();
	        setLocation(screenWidth-width/2, screenHeight-height/2);
	        
	        compareBtn.grabFocus();
	    }

	    /**
	     * Exit the Application
	     */
	    private void exitForm(WindowEvent evt) {                          
	        System.exit(0);
	    }
	    
	    private void handleListMouseEvent(JList focusList, JList affectList, boolean reverse, boolean doubleClick) {
	    	int idx = focusList.getSelectedIndex();
	    	affectList.setSelectedIndex(idx);
	    	
	    	JList la = null;
	    	JList lb = null;
	    	if (reverse) {
	    		la = affectList;
	    		lb = focusList;
	    	} else {
	    		la = focusList;
	    		lb = affectList;
	    	}
	    	
	    	if (null == la.getSelectedValue() || null == lb.getSelectedValue()) {
				return;
			}
			
	    	String file1 = ((FileInfo)la.getSelectedValue()).fullpathName;
			String file2 = ((FileInfo)lb.getSelectedValue()).fullpathName;

			idx = file1.lastIndexOf("\\");
			idx = idx>0?idx+1:0;
			label1.setText(file1.substring(idx));
			
			idx = file2.lastIndexOf("\\");
			idx = idx>0?idx+1:0;
			label2.setText(file2.substring(idx));

			if (doubleClick) {
				mergeFile(file1, file2);
			}
	    }
	    
	    private void handleListKeyEvent(KeyEvent e, JList focusList, JList affectList) {
	    	int key = e.getKeyCode();

			switch (key) {
			case KeyEvent.VK_UP:
				affectList.setSelectedIndex(focusList.getSelectedIndex()-1);
				break;
			case KeyEvent.VK_DOWN:
				affectList.setSelectedIndex(focusList.getSelectedIndex()+1);
				break;
			case KeyEvent.VK_ENTER:
				String file1 = ((FileInfo)list1.getSelectedValue()).fullpathName;
				String file2 = ((FileInfo)list2.getSelectedValue()).fullpathName;
				if (InputEvent.CTRL_MASK == e.getModifiers()) {
					if (!NOFILE_PLACEHOLDER.equals(file1)) {
						openFolder(file1.substring(0, file1.lastIndexOf("\\")));
					}
					if (!NOFILE_PLACEHOLDER.equals(file2)) {
						openFolder(file2.substring(0, file2.lastIndexOf("\\")));
					}					
				} else {					
					mergeFile(file1, file2);
				}			
				break;
			
			}
	    }
	    
	    private void initAction() {
	    	
	    	/*
	    	 * 关闭窗口时退出程序
	    	 */
	    	addWindowListener(new WindowAdapter() {
	            public void windowClosing(WindowEvent evt) {
	                exitForm(evt);
	            }
	        });
	    	
	    	/*
	    	 * 鼠标单击时2个窗口当前项要联动，双击时打开比较工具
	    	 */
	    	list1.addMouseListener(new MouseAdapter() {
	    		public void mouseClicked(MouseEvent e) {
	    			int count = e.getClickCount();
	    			handleListMouseEvent(list1, list2, false, count>1);
	    		}
	    	});
	    	
	    	/*
	    	 * 用户按上下键时当前项要联动
	    	 */
	    	list1.addKeyListener(new KeyAdapter() {

				public void keyPressed(KeyEvent e) {
					handleListKeyEvent(e, list1, list2);
				}
	    		
	    	});
	    	
	    	list2.addMouseListener(new MouseAdapter() {
	    		public void mouseClicked(MouseEvent e) {
	    			int count = e.getClickCount();	    			
	    			handleListMouseEvent(list2, list1, true, count>1);
	    		}
	    	});
	    	
	    	/*
	    	 * 用户按上下键时当前项要联动
	    	 */
	    	list2.addKeyListener(new KeyAdapter() {

				public void keyPressed(KeyEvent e) {
					handleListKeyEvent(e, list2, list1);
				}
	    		
	    	});
	    	
	    	compareBtn.addActionListener(new ActionListener() {
				public void actionPerformed(ActionEvent e) {
					compareFiles();
				}	    		
	    	});
	    	
	    	copyBtn.addActionListener(new ActionListener() {
				public void actionPerformed(ActionEvent e) {
					copyFile();					
				}	    		
	    	});
	    }
	    
	    private void mergeFile(String file1, String file2) {
	    	if (!NOFILE_PLACEHOLDER.equals(file1) && !NOFILE_PLACEHOLDER.equals(file2)) {
				boolean lock1 = false;
				boolean lock2 = false;
				if (checkbox1.isSelected()) {
					lock1 = true;
				}
				if (checkbox2.isSelected()) {
					lock2 = true;
				}
				mergeFile(file1, lock1, file2, lock2);
			} else {
				boolean isCopy = confirmDialog("copy file?");
				if (isCopy) {
					copyFile();
				}
			}
	    }
	    
	    private void mergeFile(String file1, boolean lock1, String file2, boolean lock2) {
			try {
				model.mergeFiles(file1, lock1, file2, lock2, true);
			} catch (IOException e) {
				log.error("", e);
			} catch (InterruptedException e) {
				log.error("", e);
			}
		}
	    
	    private void copyFile() {
	    	if (null == list1.getSelectedValue()
					|| null == list2.getSelectedValue()) {
				showDialog("can't copy file to another place.");
				return;
			}
			String file1 = ((FileInfo)list1.getSelectedValue()).fullpathName;
			String file2 = ((FileInfo)list2.getSelectedValue()).fullpathName;
			
			if (NOFILE_PLACEHOLDER.equals(file1)
					&& !NOFILE_PLACEHOLDER.equals(file2)) {
				String destFileName = copyFile(file2);
				int idx = list1.getSelectedIndex();
				listModel1.remove(idx);
				listModel1.add(idx, new FileInfo(destFileName, true, false, true));
				list1.setSelectedIndex(idx);
			} else if (!NOFILE_PLACEHOLDER.equals(file1)
					&& NOFILE_PLACEHOLDER.equals(file2)) {
				String destFileName = copyFile(file1);
				int idx = list2.getSelectedIndex();
				listModel2.remove(idx);
				listModel2.add(idx, new FileInfo(destFileName, true, false, true));
				list2.setSelectedIndex(idx);
			} else {
				showDialog("can't copy file to another place.");
			}
	    }
	    
	    private String copyFile(String file1) {
	    	return model.copyReciprocalFile(file1);
	    }
	    
	    private void compareFiles() {
	    	listModel1.clear();
	    	listModel2.clear();
	    	
	    	statusLabel.setText("Comparing, please wait...");
	    	long begin = System.currentTimeMillis();
	    	java.util.List<DirPair> dirPairs = model.getComparingDirPairs();
	    	try {
	    		java.util.List<FileInfoPair> filePairs = model.compareLocalModifiedFileRecursively(dirPairs);

	    		for (FileInfoPair pair : filePairs) {
	    			if (null != pair.fileInfo1 && null != pair.fileInfo1.fullpathName) {
	    				listModel1.addElement(pair.fileInfo1);	    				
	    			} else {
	    				listModel1.addElement(new FileInfo(NOFILE_PLACEHOLDER, false, false, false));
	    			}
	    			if (null != pair.fileInfo2 && null != pair.fileInfo2.fullpathName) {
	    				listModel2.addElement(pair.fileInfo2);
	    			} else {
	    				listModel2.addElement(new FileInfo(NOFILE_PLACEHOLDER, false, false, false));
	    			}
	    		}
			} catch (Exception e) {
				log.error("", e);
			}
			list1.grabFocus();
			long end = System.currentTimeMillis();
			statusLabel.setText("Comparing used " + (end-begin)/1000 + " secs.");
	    }
	    
	    private void openFolder(String dir) {
	    	String[] cmd = new String[5];  
            cmd[0] = "cmd";  
            cmd[1] = "/c";  
            cmd[2] = "start";  
            cmd[3] = " ";  
            cmd[4] = dir;  
            try {
				Runtime.getRuntime().exec(cmd);
			} catch (IOException e) {
				log.error("", e);
			} 
	    }
	    
	    class MyCellRenderer extends JLabel implements ListCellRenderer {
	        public MyCellRenderer() {
	            setOpaque(true);
	        }
	        public Component getListCellRendererComponent(
	            JList list,
	            Object value,
	            int index,
	            boolean isSelected,
	            boolean cellHasFocus)
	        {
	        	FileInfo fi = (FileInfo)value;
	            setText(fi.fullpathName);
	            if (fi.localModified) {
	            	setBackground(Color.red);
	            	setForeground(Color.black);
	            } else {
	            	setBackground(Color.white);
	            	setForeground(Color.black);
	            }
	            
	            if (isSelected) {
	            	setBackground(Color.gray);
		            setForeground(Color.white);
	            }

	            return this;
	        }
	    }
	    
	    private void showDialog(String message) {
	    	JOptionPane.showMessageDialog(null, message, message, JOptionPane.ERROR_MESSAGE);
	    }
	    
	    private boolean confirmDialog(String message) {
	    	int result = JOptionPane.showConfirmDialog(null, message, message, JOptionPane.ERROR_MESSAGE);
	    	return 1 > result;
	    }

	    /**
	     * @param args the command line arguments
	     */
	    public static void main(String args[]) {
	    	final Log log = LogFactory.getLog(Config.class);
	        EventQueue.invokeLater(new Runnable() {
	            public void run() {
	                try {
						new MainWinSwing().setVisible(true);
					} catch (Exception e) {
						log.error("", e);
					}
	            }
	        });
	    }
	    // Variables declaration - do not modify
	    private JButton compareBtn;
	    private JButton copyBtn;
	    private JCheckBox checkbox1;
	    private JCheckBox checkbox2;
	    private JLabel label1;
	    private JLabel label2;
	    private JLabel statusLabel;
	    private JList list1;
	    private JList list2;
	    private DefaultListModel listModel1;
		private DefaultListModel listModel2;
	    private JPanel panel1;
	    private JPanel panel2;
	    private JPanel panel3;
	    private JPanel panel4;
	    private JPanel panel5;
	    private JPanel panel6;
	    private JPanel panel7;
	    
	    private JScrollPane scroll1;
	    private JScrollPane scroll2;
	    
	    private MyCellRenderer myCellRenderer;
	    // End of variables declaration
	    
	    private ModelFacade model;
	    
	    private static final String NOFILE_PLACEHOLDER = " ";
	    
	    private static final transient Log log = LogFactory.getLog(MainWinSwing.class);
		
	}
