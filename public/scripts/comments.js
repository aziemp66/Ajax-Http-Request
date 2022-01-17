const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-form form");
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

function createCommentsList(comments) {
    const commentListsElement = document.createElement("ol");

    for (const comment of comments) {
        const commentElement = document.createElement("li");
        commentElement.innerHTML = `
        <article class="comment-item">
            <h2>${comment.title}</h2>
            <p>${comment.text}</p>
        </article>
        `;
        commentListsElement.appendChild(commentElement);
    }

    return commentListsElement;
}

async function fetchCommentsForPosts() {
    const postId = loadCommentsBtnElement.dataset.postid;
    const response = await fetch(`/posts/${postId}/comments`);
    const responseData = await response.json();

    if (responseData && responseData.length > 0) {
        const commentsListElement = createCommentsList(responseData);
        commentSectionElement.innerHTML = "";
        commentSectionElement.appendChild(commentsListElement);
    } else {
        commentSectionElement.firstElementChild.textContent =
            "We could not find any comments. Maybe add one?";
    }
}

async function saveComment(event) {
    event.preventDefault();
    const postId = commentsFormElement.dataset.postid;

    const enteredTitle = commentTitleElement.value;
    const enteredText = commentTextElement.value;

    const comment = { title: enteredTitle, text: enteredText };

    const response = await fetch(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
            "Content-Type": "application/json",
        },
    });

    fetchCommentsForPosts();
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPosts);
commentsFormElement.addEventListener("submit", saveComment);
