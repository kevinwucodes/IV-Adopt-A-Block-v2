//
//  LocationStore.swift
//  IslaVistaAdoptABlock
//
//  Created by Thomas Kuo on 6/26/14.
//  Copyright (c) 2014 Citrix Hackathon. All rights reserved.
//

import CoreLocation

class LocationStore: NSObject, CLLocationManagerDelegate {
    
    var locationManager: CLLocationManager = CLLocationManager()
    var locationDictionary: [[String:AnyObject]]?
    var currentLocations = [[String:Double]]()
    var lastSentRealtimeDataEpoch: Double?
    var sendingRealtimData: Bool = false
    let REALTIME_THRESHOLD: Double = 10000.0 //120000.0 // sending threshold in milliseconds
    
    func startLocation() {
        startLocation(nil)
    }
    
    func startLocation(delegate: CLLocationManagerDelegate?) {
        if currentLocations.count > 0 {
            currentLocations.removeAll(keepCapacity: false)
        }
        
        // Create the location manager if this object does not
        // already have one.
        if locationManager == nil {
            locationManager = CLLocationManager()
        }
        
        if let del = delegate {
            locationManager.delegate = del
        } else {
            locationManager.delegate = self
        }
        
        locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        
        // Set a movement threshold for new events.
        locationManager.distanceFilter = 1; // meters
        
        locationManager.requestAlwaysAuthorization()
        locationManager.startUpdatingLocation()
    }
    
    func stopLocation() {
        locationManager.stopUpdatingLocation()
    }
    
    
    func locationManager(manager: CLLocationManager!, didUpdateLocations locations: [AnyObject]!) {
        let currLocation: CLLocation = locations[0] as CLLocation
        let epoch = round(1000*currLocation.timestamp.timeIntervalSince1970)
        let locationDictionary: [String:Double] = ["lat": currLocation.coordinate.latitude, "long": currLocation.coordinate.longitude, "epoch": epoch]
        
        println(locationDictionary)
        
        currentLocations.append(locationDictionary)
        
        if shouldSendRealtimeLocation(locationDictionary) {
            sendRealtimeLocation(locationDictionary)
        }
    }
    
    func shouldSendRealtimeLocation(data: Dictionary<String, Double>) -> Bool {
        if let evallastSentRealtimeDataEpoch = lastSentRealtimeDataEpoch {
            if !sendingRealtimData && (data["epoch"]! - evallastSentRealtimeDataEpoch) > REALTIME_THRESHOLD {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    }
    
    func sendRealtimeLocation(data: Dictionary<String, Double>) {
        let defaults = NSUserDefaults.standardUserDefaults()
        let uid_anyobject : AnyObject! = defaults.objectForKey("UID")
        var uid: String
        if uid_anyobject != nil {
            uid = uid_anyobject as String
        } else {
            return
        }
        
        let name_anyobject : AnyObject! = defaults.objectForKey("name")
        var name: String
        if name_anyobject != nil {
            name = name_anyobject as String
        } else {
            return
        }
        
        var submission: Dictionary<String,AnyObject> = ["username": name, "hashID": uid]
        for (key, value) in data {
            submission[key] = value
        }
        
        var e: NSError?
        let jsonData = NSJSONSerialization.dataWithJSONObject(
            submission,
            options: NSJSONWritingOptions(0),
            error: &e)
        
        var request = NSMutableURLRequest(URL: NSURL(string: "http://adopt-a-block.herokuapp.com/realtime"))
        request.HTTPMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let uploadSession = NSURLSession.sharedSession()
        
        lastSentRealtimeDataEpoch = data["epoch"]!
        sendingRealtimData = true
        let uploadTask = uploadSession.uploadTaskWithRequest(request, fromData: jsonData) {data, response, error -> Void in
            self.sendingRealtimData = false
            if (!error) {
                println("Worked!")
            } else {
                println("Didn't work :(")
            }
        }
        
        uploadTask.resume()
    }
    
    func locationManager(manager: CLLocationManager!, didFailWithError error: NSError!) {
        println("LM Error")
    }
    
    func submitLocation(name: String, uid: String, num_buckets: Int) {
        var submission = ["username": name, "hashID":uid, "buckets":num_buckets, "points": currentLocations, "userCategory": "TEST", "comments": "I'm a grouch"]
        
        var e: NSError?
        let jsonData = NSJSONSerialization.dataWithJSONObject(
            submission,
            options: NSJSONWritingOptions(0),
            error: &e)
        
        var jsonString: String
        if !jsonData {
            jsonString = ""
        } else {
            jsonString = NSString(data: jsonData, encoding: NSUTF8StringEncoding)
        }
        
        println(jsonString)
        
        var request = NSMutableURLRequest(URL: NSURL(string: "http://adopt-a-block.herokuapp.com/ivCollection"))
        request.HTTPMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let uploadSession = NSURLSession.sharedSession()
        
        let uploadTask = uploadSession.uploadTaskWithRequest(request, fromData: jsonData) {data, response, error -> Void in
            if (!error) {
                println("Worked!")
            } else {
                println("Didn't work :(")
            }
        }
        
        uploadTask.resume()
    }
    
}