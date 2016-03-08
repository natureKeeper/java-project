package net.sherwin.cvstool.view;

import java.awt.BorderLayout;
import java.awt.Button;
import java.awt.Checkbox;
import java.awt.Dimension;
import java.awt.EventQueue;
import java.awt.Frame;
import java.awt.GridLayout;
import java.awt.Label;
import java.awt.List;
import java.awt.Panel;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import net.sherwin.cvstool.model.ModelFacade;
import net.sherwin.cvstool.model.data.DirPair;
import net.sherwin.cvstool.model.data.FileInfoPair;

public class MainWin extends Frame {

	    /**
	     * Creates new form AwtUi
	     */
	    public MainWin() {
	        initComponents();
	        initModel();
	        initAction();
	    }
	    
	    private void initModel() {
	    	model = new ModelFacade();
	    }

	    private void initComponents() {

	        panel1 = new Panel();
	        panel3 = new Panel();
	        panel7 = new Panel();
	        checkbox1 = new Checkbox();
	        list1 = new List();
	        panel4 = new Panel();
	        checkbox2 = new Checkbox();
	        list2 = new List();
	        panel2 = new Panel();
	        panel5 = new Panel();
	        panel6 = new Panel();
	        compareBtn = new Button();
	        copyBtn = new Button();
	        label1 = new Label();
	        label1.setAlignment(Label.CENTER);
	        
	        label2 = new Label();
	        label2.setAlignment(Label.CENTER);
	        
	        statusLabel = new Label();
	        

	        setIconImage(Toolkit.getDefaultToolkit().createImage(ClassLoader.getSystemResource("title.gif")));
	        setMinimumSize(new Dimension(800, 600));
	        setPreferredSize(new Dimension(800, 600));
	        setTitle("cvs trunk-branch merger alpha by sherwin");
	        

	        panel1.setLayout(new GridLayout(2, 1));

	        panel3.setLayout(new BorderLayout());

	        checkbox1.setLabel("Locked");
	        panel3.add(checkbox1, BorderLayout.WEST);
	        panel3.add(list1, BorderLayout.CENTER);
	        panel3.add(panel5, BorderLayout.SOUTH);
	        
	        panel5.setLayout(new BorderLayout());
	        panel5.add(label1, BorderLayout.CENTER);

	        panel1.add(panel3);

	        panel4.setLayout(new BorderLayout());

	        checkbox2.setLabel("Locked");
	        panel4.add(checkbox2, BorderLayout.WEST);
	        panel4.add(list2, BorderLayout.CENTER);
	        panel4.add(panel6, BorderLayout.SOUTH);
	        
	        panel6.setLayout(new BorderLayout());
	        panel6.add(label2, BorderLayout.CENTER);

	        panel1.add(panel4);

	        add(panel1, BorderLayout.CENTER);

	        compareBtn.setLabel("Compare");
	        copyBtn.setLabel("Copy");
	        panel2.setLayout(new GridLayout(2, 1));
	        panel2.add(panel7);
	        panel7.add(compareBtn);
	        panel7.add(copyBtn);
	        panel2.add(statusLabel);

	        add(panel2, BorderLayout.SOUTH);

	        pack();
	    }// </editor-fold>

	    /**
	     * Exit the Application
	     */
	    private void exitForm(WindowEvent evt) {                          
	        System.exit(0);
	    }
	    
	    private void handleListEvent(List focusList, List affectList, boolean reverse, boolean doubleClick) {
	    	int idx = focusList.getSelectedIndex();
	    	affectList.select(idx);
	    	
	    	List la = null;
	    	List lb = null;
	    	if (reverse) {
	    		la = affectList;
	    		lb = focusList;
	    	} else {
	    		la = focusList;
	    		lb = affectList;
	    	}
	    	
			
	    	String file1 = la.getSelectedItem();
			String file2 = lb.getSelectedItem();
			
			if (null == file1 || null == file2) {
				return;
			}
			
			idx = file1.lastIndexOf("\\");
			idx = idx>0?idx+1:0;
			label1.setText(file1.substring(idx));
			
			idx = file2.lastIndexOf("\\");
			idx = idx>0?idx+1:0;
			label2.setText(file2.substring(idx));

			if (doubleClick) {
				boolean lock1 = false;
				boolean lock2 = false;
				if (checkbox1.getState()) {
					lock1 = true;
				}
				if (checkbox2.getState()) {
					lock2 = true;
				}
				mergeFile(file1, lock1, file2, lock2);
			}
	    }
	    
	    private void initAction() {
	    	addWindowListener(new WindowAdapter() {
	            public void windowClosing(WindowEvent evt) {
	                exitForm(evt);
	            }
	        });
	    	
	    	list1.addMouseListener(new MouseAdapter() {
	    		public void mouseClicked(MouseEvent e) {
	    			int count = e.getClickCount();
	    			handleListEvent(list1, list2, false, count>1);
	    		}
	    	});
	    	
	    	list2.addMouseListener(new MouseAdapter() {
	    		public void mouseClicked(MouseEvent e) {
	    			int count = e.getClickCount();	    			
	    			handleListEvent(list2, list1, true, count>1);
	    		}
	    	});
	    	
	    	compareBtn.addActionListener(new ActionListener() {
				public void actionPerformed(ActionEvent e) {
					compareFiles();
				}	    		
	    	});
	    	
	    	copyBtn.addActionListener(new ActionListener() {
				public void actionPerformed(ActionEvent e) {
					String file1 = list1.getSelectedItem();
					String file2 = list2.getSelectedItem();
					
					if ("".equals(file1)
							&& !"".equals(file2)) {
						String destFileName = copyFile(file2);
						int idx = list1.getSelectedIndex();
						list1.remove(idx);
						list1.add(destFileName, idx);						
					} else if (!"".equals(file1)
							&& "".equals(file2)) {
						String destFileName = copyFile(file1);
						int idx = list2.getSelectedIndex();
						list2.remove(idx);
						list2.add(destFileName, idx);						
					}
					
				}	    		
	    	});
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
	    
	    private String copyFile(String file1) {
	    	return model.copyReciprocalFile(file1);
	    }
	    
	    private void compareFiles() {
	    	list1.removeAll();
	    	list2.removeAll();
	    	
	    	statusLabel.setText("Comparing, please wait...");
	    	long begin = System.currentTimeMillis();
	    	java.util.List<DirPair> dirPairs = model.getComparingDirPairs();
	    	try {
	    		java.util.List<FileInfoPair> filePairs = model.compareLocalModifiedFileRecursively(dirPairs);
	    		for (FileInfoPair pair : filePairs) {
	    			if (null != pair.fileInfo1 && null != pair.fileInfo1.fullpathName) {
	    				list1.add(pair.fileInfo1.fullpathName);
	    			} else {
	    				list1.add("");
	    			}
	    			if (null != pair.fileInfo2 && null != pair.fileInfo2.fullpathName) {
	    				list2.add(pair.fileInfo2.fullpathName);
	    			} else {
	    				list2.add("");
	    			}
	    		}	    		
			} catch (Exception e) {
				log.error("", e);
			}
			long end = System.currentTimeMillis();
			statusLabel.setText("Comparing used " + (end-begin)/1000 + " secs.");
	    }

	    /**
	     * @param args the command line arguments
	     */
	    public static void main(String args[]) {
	        EventQueue.invokeLater(new Runnable() {
	            public void run() {
	                new MainWin().setVisible(true);
	            }
	        });
	    }
	    // Variables declaration - do not modify
	    private Button compareBtn;
	    private Button copyBtn;
	    private Checkbox checkbox1;
	    private Checkbox checkbox2;
	    private Label label1;
	    private Label label2;
	    private Label statusLabel;
	    private List list1;
	    private List list2;
	    private Panel panel1;
	    private Panel panel2;
	    private Panel panel3;
	    private Panel panel4;
	    private Panel panel5;
	    private Panel panel6;
	    private Panel panel7;
	    // End of variables declaration
	    
	    private ModelFacade model;
	    
	    private static final transient Log log = LogFactory.getLog(MainWin.class);
		
	}
