
// Supabaseとの接続
const SUPABASE_URL = "https://asbpcgfpnhpdrldlhcqv.supabase.co";
const SUPABASE_KEY = "sb_publishable_WAcDDQDVnMt3hlhqNBIM5g_ErXuqRs0";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
// 投稿フォーム
const form = document.querySelector("form");

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const name = form.querySelector('[name="name"]').value;
  const message = form.querySelector('[name="message"]').value;

  const { error } = await supabaseClient
    .from("posts")
    .insert([
      {
        name: name,
        content: message
      }
    ]);

  if (error) {
    alert("投稿できませんでした");
    console.error(error);
  } else {
    alert("投稿できました！");
    form.reset();
  }
});
// 保存された投稿を読み込む
async function loadPosts() {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const postsArea = document.getElementById("posts");

  postsArea.innerHTML = "";

 data.forEach(function(post, index) {
  const postElement = document.createElement("div");
  postElement.dataset.postId = post.id;
postElement.classList.add("bbs-post");

  const date = new Date(post.created_at);
  const formattedDate = date.toLocaleString("ja-JP");

 postElement.innerHTML = `
  <p>No.${data.length - index}</p>
  <p>${formattedDate}</p>
  <p>${post.name}</p>
  <p>${post.content}</p>
 <button class="reply-button">返信する</button>
  <hr>
`;

    postsArea.appendChild(postElement);
  });
}


// ページを開いたときに投稿を読み込む
form.reset();
loadPosts();

   
// 返信ボタンの動作
document.addEventListener("click", function(event) {
  const button = event.target.closest(".reply-button");

  if (!button) return;

  const postElement = button.closest(".bbs-post");

  const existingForm = postElement.querySelector(".reply-form");

  if (existingForm) {
    existingForm.remove();
    return;
  }

  const replyForm = document.createElement("div");
  replyForm.classList.add("reply-form");
  replyForm.dataset.postId = postElement.dataset.postId;

  replyForm.innerHTML = `
  <p>▼ 返信を書く</p>
  <p>名前：</p>
  <input type="text" class="reply-name" placeholder="名前">
  <p>メッセージ：</p>
  <textarea class="reply-content" rows="4" placeholder="返信メッセージ"></textarea>
  <p><button class="reply-submit">返信を投稿</button></p>
`;

  postElement.appendChild(replyForm);
    const submitButton = replyForm.querySelector(".reply-submit");

  submitButton.addEventListener("click", async function() {
    const name = replyForm.querySelector(".reply-name").value;
    const content = replyForm.querySelector(".reply-content").value;
    const postId = replyForm.dataset.postId;

    const { error } = await supabaseClient
      .from("replies")
      .insert([
        {
          post_id: postId,
          name: name,
          content: content
        }
      ]);

    if (error) {
      alert("返信できませんでした");
      console.error(error);
    } else {
      alert("返信できました！");
      replyForm.remove();
    }
  });
});
