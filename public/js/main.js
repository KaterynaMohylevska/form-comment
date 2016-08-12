document.addEventListener("DOMContentLoaded",ready);

function ready() {
  getAllComments();

  var form = document.querySelector('.comment-form')
  var commentList = document.querySelector('.comment-list')

  form.addEventListener('submit', addComment);
  commentList.addEventListener('click', findDeleteComment);
}


function addComment(event) {
  event.preventDefault();

  var xhr = new XMLHttpRequest();
  var form = document.querySelector('.comment-form');

  xhr.addEventListener('load', drawNewComment);
  xhr.addEventListener('error', transferError);

  var data = {
    "name" : form.elements["name"].value,
    "email" : form.elements["email"].value,
    "message" : form.elements["comment"].value
  }

  xhr.open("POST","/comments");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));
}

function drawNewComment(){
  drawComment(JSON.parse(this.responseText));
}

function getAllComments() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', drawAllComments);
  xhr.addEventListener('error', transferError);

  xhr.open("GET","/comments");
  xhr.send();
}

function drawAllComments(event) {
  var comments = JSON.parse(this.responseText);

  comments.forEach(function(comment, index) {
    drawComment(comment);
  });
}

function drawComment(data) {
  var comment = document.createElement("article");
  comment.className = "comment";
  comment.setAttribute('data-id', data.id);
  comment.innerHTML = "<i class='fa fa-trash comment--delete' aria-hidden='true'></i>" +
                        "<header>Added by " +
                        data.name +
                        "</header><p>" +
                        data.message +
                        "</p>";
  var commentList = document.querySelector('.comment-list');
  commentList.appendChild(comment);
}

function transferError() {
  console.log("Error!! ", this.status);
}

function findDeleteComment(event) {
  var target = event.target;

  if (target.classList.contains("comment--delete")){
    while (!target.classList.contains("comment")) {
      target = target.parentNode;
    }

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', deleteComment(target));
    xhr.addEventListener('error', transferError);

    xhr.open("DELETE","/comments/" + target.getAttribute("data-id"));
    xhr.send();
  }

}

function deleteComment(target) {
  var commentList = document.querySelector('.comment-list');
  commentList.removeChild(target);
}
