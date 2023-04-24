document.addEventListener("DOMContentLoaded", () => {
  
      var pathname = window.location.pathname.split( '/' );
      const Spinner = document.getElementById("spinner")
      const message = document.getElementById("message")

      // Post Form
      const postButton = document.getElementById("PostBtn")

      // Reply Form
      const replyPostButton = document.getElementById("PostReplyBtn")
      const replyBotton = document.getElementById("ReplyBtn")
      const replyForm = document.getElementById("reply-form")

      message.style.display = "none";


      // Post Form
      postButton?.addEventListener("click", function () {
        let bodyValue = document.getElementById("description").value
        let titeValue = document.getElementById("title").value
        var http = new XMLHttpRequest();
  
        var postBody = {
          title: titeValue,
          body: bodyValue
        }
        
        http.open("POST", "/api/create/");
        http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        http.send(JSON.stringify(postBody));

        http.ontimeout = (e) => {
            Spinner.classList.remove("spinner-border", "spinner-border-sm");
            postButton.removeAttribute("disabled", "");
            message.style.display = "block"
            message.classList.add("alert-info")
            message.innerText = `Unable to post - Request Timeout`
        };

        http.onreadystatechange = function() {

            if (this.readyState == 4) {

                Spinner.classList.remove("spinner-border", "spinner-border-sm");
                postButton.removeAttribute("disabled", "");

                if(this.status == 0) {
                    message.style.display = "block"
                    message.classList.add("alert-info")
                    message.innerText = `Unable to post - Failed to send request`
                    return;
                }

                if(this.status == 500) {
                    message.style.display = "block"
                    message.classList.add("alert-info")
                    message.innerText = "Unable to post - An Internal Server Error occurred"
                    return;
                }

                var requestResponse = JSON.parse(http.responseText)

                if(this.status == 201) {
                    if(requestResponse["error"] == false) {
                        message.style.display = "block"
                        if(message.classList.contains("alert-danger")) { message.classList.remove("alert-danger") }
                        message.classList.add("alert-success")
                        message.innerText = requestResponse["message"]
                        window.location.href = window.location.protocol + "//" + window.location.host + "/posts/" + requestResponse["postId"]
                    };
                }

                if(this.status == 400) {
                    message.style.display = "block"
                    message.classList.add("alert-danger")
                    message.innerText = requestResponse["message"]
                    return;
                }

                if(this.status == 429) {
                    if(requestResponse["error"] == true) {
                        message.style.display = "block"
                        message.classList.add("alert-danger")
                        message.innerText = requestResponse["message"]
                    };
                }

            };
        };
      
          event.preventDefault();
  
      });



      // Reply Form
      replyBotton?.addEventListener("click", function () {
        if(replyForm.style.display === "none") {
            replyForm.style.display = "block";
        } else {
            replyForm.style.display = "none"
        };
      });

      replyPostButton?.addEventListener("click", function () {
        let bodyValue = document.getElementById("description").value
        let usernameValue = document.getElementById("username").value
        var http = new XMLHttpRequest();
  
        var postBody = {
          poster: usernameValue,
          postId: pathname[2],
          content: bodyValue
        }
        
        http.open("POST", "/api/create/reply");
        http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        http.send(JSON.stringify(postBody));

        http.ontimeout = (e) => {
            Spinner.classList.remove("spinner-border", "spinner-border-sm");
            replyPostButton.removeAttribute("disabled", "");
            message.style.display = "block"
            message.classList.add("alert-info")
            message.innerText = `Unable to post reply - Request Timeout`
        };

        http.onreadystatechange = function() {

            if (this.readyState == 4) {

                Spinner.classList.remove("spinner-border", "spinner-border-sm");
                replyPostButton.removeAttribute("disabled", "");

                if(this.status == 0) {
                    message.style.display = "block"
                    message.classList.add("alert-info")
                    message.innerText = `Unable to post reply - Failed to send request`
                    return;
                }

                if(this.status == 500) {
                    message.style.display = "block"
                    message.classList.add("alert-info")
                    message.innerText = "Unable to post reply - An Internal Server Error occurred"
                    return;
                }

                var requestResponse = JSON.parse(http.responseText)

                if(this.status == 201) {
                    if(requestResponse["error"] == false) {
                        message.style.display = "block"
                        if(message.classList.contains("alert-danger")) { message.classList.remove("alert-danger") }
                        message.classList.add("alert-success")
                        message.innerText = requestResponse["message"]
                        window.location.reload();
                    };
                }

                if(this.status == 400) {
                    message.style.display = "block"
                    message.classList.add("alert-danger")
                    message.innerText = requestResponse["message"]
                    return;
                }

                if(this.status == 429) {
                    if(requestResponse["error"] == true) {
                        message.style.display = "block"
                        message.classList.add("alert-danger")
                        message.innerText = requestResponse["message"]
                    };
                }


                if(this.status == 500) {
                    message.style.display = "block"
                    message.classList.add("alert-info")
                    message.innerText = "Unable to post reply - An Internal Server Error occurred"
                }

            };
        };
      
          event.preventDefault();
  
      });
    
  
  });
  