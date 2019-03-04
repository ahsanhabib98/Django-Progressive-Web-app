fetch('http://127.0.0.1:8000/getdata').then(function(response){
  return response.json();
 }).then(function(jsondata){
  console.log(jsondata);
 });


var dbPromise = idb.open('feeds-db', 1, function(upgradeDb) {
 upgradeDb.createObjectStore('feeds',{keyPath:'pk'});
 upgradeDb.createObjectStore('users',{keyPath:'username'});
 upgradeDb.createObjectStore('loginuser',{keyPath:'pk'});
});


fetch('http://127.0.0.1:8000/getdata').then(function(response){
  return response.json();
 }).then(function(jsondata){
  dbPromise.then(function(db){
   var tx = db.transaction('feeds', 'readwrite');
     var feedsStore = tx.objectStore('feeds');
     for(var key in jsondata){
      if (jsondata.hasOwnProperty(key)) {
        feedsStore.put(jsondata[key]); 
      }
     }
  });
 });


var post="";
 dbPromise.then(function(db){
  var tx = db.transaction('feeds', 'readonly');
    var feedsStore = tx.objectStore('feeds');
    return feedsStore.openCursor();
 }).then(function logItems(cursor) {
    if (!cursor) {
     document.getElementById('offlinedata').innerHTML=post;
      return;
    }
    
    for (var field in cursor.value) {
       if(field=='fields'){
        feedsData=cursor.value[field];
        for(var key in feedsData){
         if(key =='title'){
          var title = '<h3>'+feedsData[key]+'</h3>';
         }
         if(key =='author'){
          var author = feedsData[key];
         }
         if(key == 'body'){
          var body = '<p>'+feedsData[key]+'</p>';
         } 
        }
        post=post+'<br>'+title+'<br>'+author+'<br>'+body+'<br>';
       }
      }
    return cursor.continue().then(logItems);
  });


 // registration part


//  var dbPromise = idb.open('users-db', 1, function(upgradeDb) {
//  upgradeDb.createObjectStore('users',{keyPath:'username'});
// });


function registration() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  if (username.indexOf(" ") >= 0){
  	document.getElementById('alert').innerHTML = 'Invalid username.';
  }
  if (password.length < 9){
  	document.getElementById('alert').innerHTML = 'At least password 9 character.';
  }
  else{
	  var email = document.getElementById('email').value;
	  var confirmpassword = document.getElementById('confirmpassword').value;
	  console.log(username);
	  console.log(email);
	  console.log(password);

	  if(password != confirmpassword){
				document.getElementById('alert').innerHTML = 'Password does not match.';          
	        }
	  else{
	  	document.getElementById('alert').innerHTML = '';
	  	var user = {};
	  	user.username = username
	  	user.email = email
	  	user.password = password
	  	user.confirmpassword = confirmpassword
	  	var form = document.getElementById("myForm");
	  	form.reset();

	  	dbPromise.then(function(db){
	  	 console.log('working db')
		 var tx = db.transaction('users', 'readwrite');
		  var usersStore = tx.objectStore('users');
		   if (user) {
		     usersStore.put(user); 
		   }
		});
	  }
	}
}



var user=[];
 dbPromise.then(function(db){
  var tx = db.transaction('users', 'readonly');
    var usersStore = tx.objectStore('users');
    return usersStore.openCursor();
 }).then(function logItemsu(cursor) {
 	if (!cursor) {
 		 console.log('user working')
	     console.log(user)
	     fetch('http://127.0.0.1:8000/signup', {
	     	method: "post",
	     	body: JSON.stringify(user),
	     	headers:{
			   'Content-Type': 'application/json'
			}
	     }).then(function(response) {
		      if(response.ok){
		        return response.json();
		    }{
		        throw new Error("Post Failed")
		    }
		}).then(function(responseBody){
		    console.log(responseBody)
		})
		.catch(function(error) {
		    console.log("Request failed", error);
		});
				
    }
    user.push(cursor.value);
    return cursor.continue().then(logItemsu);
  });



 // login part


 fetch('http://127.0.0.1:8000/users').then(function(response){
  return response.json();
 }).then(function(jsondata){
  dbPromise.then(function(db){
   var tx = db.transaction('loginuser', 'readwrite');
     var usersStore = tx.objectStore('loginuser');
     for(var key in jsondata){
      if (jsondata.hasOwnProperty(key)) {
        usersStore.put(jsondata[key]); 
      }
     }
  });
 });


 function loginUser() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);

    var form = document.getElementById("loginForm");
	form.reset();

	dbPromise.then(function(db){
	  var tx = db.transaction('loginuser', 'readonly');
	    var usersStore = tx.objectStore('loginuser');
	    return usersStore.openCursor();
	 }).then(function logItemsl(cursor) {
	    if (!cursor) {
	     document.getElementById('alert').innerHTML = '';
	      return;
	    }
	    var mark = 0;
	    for (var field in cursor.value) {
	       if(mark == 1){
	       		break;
	       }
	       if(field=='fields'){
	        usersData=cursor.value[field];
	        for(var key in usersData){
	         if(key =='username'){
	          var username1 = usersData[key];
	          if(username == username1){
	          	var obj = {}
	          	obj.username = username;
	          	obj.password = password;
	          	console.log(obj);
	          	mark = 1;
	          	break;
	          }
	         } 
	        }
	       }
	      }
	    if(mark == 1){
	    	console.log(obj);
	    	fetch('http://127.0.0.1:8000/signin', {
	     	method: "post",
	     	body: JSON.stringify(obj),
	     	headers:{
				   'Content-Type': 'application/json'
				}
		     }).then(function(response) {
			      if(response.ok){
			      	document.getElementById('welcome').innerHTML = '<h1> Welcome </h1>';
			        console.log(response.data);
			    }{
			        throw new Error("Post Failed")
			    }
			}).then(function(responseBody){
			    console.log(responseBody)
			})
			.catch(function(error) {
			    console.log("Request failed", error);
			});
		    }
	    return cursor.continue().then(logItemsl);
	  });
}