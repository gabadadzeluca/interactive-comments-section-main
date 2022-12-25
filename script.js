"use strict"; 

fetch('data.json')
.then(response => response.json())
  .then(data => {
    let comments = data.comments;
    addComments(comments);
  });
let commentHTML = '';
function addComments(comments){
    for(let i = 0; i<comments.length; i++){
        commentHTML += createCommentHTML(comments[i], false);
    }
    document.querySelector('main').innerHTML = commentHTML;
}


// function createCommentDiv(comment){

//   //comment thread container 
//   const commentThread = document.createElement('div');
//   commentThread.classList.add("thread");
//   // create comment div
//   const commentDiv = document.createElement('div');
//   commentDiv.classList.add('comment');

//   // add image div
//   const imageDiv = document.createElement('div');
//   const img = document.createElement('img');
//   img.src = comment.user.image.webp;
//   imageDiv.appendChild(img);

//   // date div
//   const date = document.createElement('div');
//   date.classList.add('date-posted');
//   date.innerHTML = comment.createdAt;

//   // inline div of a container
//   const divHeader = document.createElement('div');
//   divHeader.classList.add('div-header');
//   divHeader.appendChild(imageDiv);
//   divHeader.appendChild(date);

//   // content div
//   const contentDiv = document.createElement('div');
//   contentDiv.classList.add('content');
//   const replyToSpan = document.createElement('span');
//   replyToSpan.classList.add('tag');
//   // replyToSpan.innerHTML = comment.replyingTo;
//   const content = document.createElement('div');
//   content.innerHTML = comment.content;
//   contentDiv.appendChild(replyToSpan);
//   contentDiv.appendChild(content);

//   commentDiv.appendChild(divHeader);
//   commentDiv.appendChild(contentDiv);


  
//   //display score 
//   const scoreDiv = document.createElement('div');
//   const plus = document.createElement('p');
//   plus.innerHTML = "+";
//   plus.classList.add('plus');
//   const minus = document.createElement('p');
//   minus.innerHTML = "-"
//   minus.classList.add('minus');
//   const score = document.createElement('p');
//   score.innerHTML = comment.score;

//   scoreDiv.appendChild(plus);
//   scoreDiv.appendChild(score);
//   scoreDiv.appendChild(minus);

//   commentDiv.appendChild(scoreDiv);
//   document.querySelector('main').appendChild(commentThread);
//   commentThread.appendChild(commentDiv);
  
//   // reply btn
//   const replyBtn = document.createElement('p');
//   replyBtn.innerHTML = 'Reply';
//   replyBtn.classList.add('reply-btn');
//   commentDiv.appendChild(replyBtn);

//   // displayReplies(comment, commentThread);
// }



function createCommentHTML(commentData, isReply) {
  console.log(":",commentData.user.username);
  // Build the HTML for the comment
  let commentHTML = '';
  if (!isReply) {
    commentHTML += '<div class="comment-thread">';
  }
  commentHTML += '<div class="comment">';

  // open inline div
  commentHTML += '<div class="inline">';
  //add img
  commentHTML += '<div class="comment-author">' + `<img src=${commentData.user.image.webp}>` + '</div>';
  //add username
  commentHTML += '<div class="username">' + `<p>${commentData.user.username}</p></div>`;
  // add date
  commentHTML += '<div class="date">' + commentData.createdAt + '</div>';
  // close inline div
  commentHTML += '</div>'
  
  // add tag
  let replyDiv;
  isReply? replyDiv = `<span class="tag"> ${commentData.replyingTo} </span>` : replyDiv = '';

  //content div
  commentHTML += '<div class="comment-content">' + `<p>${replyDiv}${commentData.content}</p>` + '</div>';

  // score
  commentHTML += '<div class="score">' + `<p class="plus">+</p><p>${commentData.score}</p><p>-</p>` + '</div>';

  // reply button
  commentHTML += '<div class="reply">' + 'Reply' + '</div>';



  // If the comment has replies, add a div for the replies
  if (commentData.replies && commentData.replies.length > 0) {
    commentHTML += '<div class="comment-replies">';
    // Add HTML for each reply
    commentData.replies.forEach(function(reply) {
      commentHTML += createCommentHTML(reply, true);
    });
    commentHTML += '</div>';
  }

  commentHTML += '</div>';
  if (!isReply) {
    commentHTML += '</div>';
  }
  return commentHTML;
}

