//
//  ViewController.swift
//  IslaVistaAdoptABlock
//
//  Created by Thomas Kuo on 6/25/14.
//  Copyright (c) 2014 Citrix Hackathon. All rights reserved.
//

import UIKit
import CoreLocation

class ViewController: UIViewController, UITextFieldDelegate, CLLocationManagerDelegate {
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var actionButton: UIButton!
    @IBOutlet weak var bucketLabel: UILabel!
    @IBOutlet weak var bucketTextField: UITextField!
    @IBOutlet weak var submitButton: UIButton!
    var locationStore: LocationStore = LocationStore()
                            
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        let defaults = NSUserDefaults.standardUserDefaults()
        let name : AnyObject! = defaults.objectForKey("name")
        
        var textFieldName: String = ""
        if name != nil {
            textFieldName = name as String
        }
        
        if textFieldName != "" {
            nameTextField.text = name as NSString
            actionButton.enabled = true
        } else {
            actionButton.enabled = false
        }
        
        showCollectState()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func pressedActionButton(sender: UIButton) {
        if sender.titleLabel.text == "Start" {
            sender.setTitle("Stop", forState: UIControlState.Normal)
            
            locationStore.startLocation()
            
            bucketTextField.text = ""
            
            nameTextField.enabled = false
        } else {
            sender.setTitle("Start", forState: UIControlState.Normal)
            
            locationStore.stopLocation()
            
            showSubmitState()
        }
    }

    @IBAction func pressedSubmit(sender: UIButton) {
        view.endEditing(true)
        
        let defaults = NSUserDefaults.standardUserDefaults()
        let uid: NSString! = defaults.objectForKey("UID") as AnyObject! as NSString!
        
        if nameTextField.text == "" {
            var alert = UIAlertController(title: "No Name", message: "Enter a name to submit", preferredStyle: UIAlertControllerStyle.Alert)
            alert.addAction(UIAlertAction(title: "Click", style: UIAlertActionStyle.Default, handler: nil))
            self.presentViewController(alert, animated: true, completion: nil)
        } else if bucketTextField.text.isEmpty || bucketTextField.text.toInt() == nil {
            var alert = UIAlertController(title: "No buckets", message: "Enter the number of buckets collected", preferredStyle: UIAlertControllerStyle.Alert)
            alert.addAction(UIAlertAction(title: "Click", style: UIAlertActionStyle.Default, handler: nil))
            self.presentViewController(alert, animated: true, completion: nil)
        } else {
            locationStore.submitLocation(nameTextField.text, uid: uid, num_buckets: bucketTextField.text.toInt()!)
            
            showCollectState()
            
            nameTextField.enabled = true
        }
    }

    @IBAction func nameTextFieldDidEndOnExit(sender: UITextField) {

    }

    @IBAction func nameTextFieldEditingDidEnd(sender: UITextField) {
        NSUserDefaults.standardUserDefaults().setObject(sender.text, forKey: "name")
        NSUserDefaults.standardUserDefaults().synchronize()
        
        if sender.text != "" {
            actionButton.enabled = true
        } else {
            actionButton.enabled = false
        }
    }
    
    func showSubmitState() {
        bucketTextField.hidden = false
        bucketLabel.hidden = false
        submitButton.hidden = false
        
        actionButton.hidden = true
    }
    
    func showCollectState() {
        bucketTextField.hidden = true
        bucketLabel.hidden = true
        submitButton.hidden = true
        
        actionButton.hidden = false
    }
    
    override func touchesBegan(touches: NSSet!, withEvent event: UIEvent!) {
        var touch: UITouch = event.allTouches().anyObject() as UITouch
        
        if nameTextField.isFirstResponder() && nameTextField != touch.view {
            nameTextField.resignFirstResponder()
        } else if bucketTextField.isFirstResponder() && bucketTextField != touch.view {
            bucketTextField.resignFirstResponder()
        }
    }
}

