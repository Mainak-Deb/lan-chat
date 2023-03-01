class Chats {
  constructor() {
    this.chatBox = new Map();
  }
  insert(author, message, isSender) {
    const d = new Date();
    if (this.chatBox.has(author)) {
      console.log("in");
      this.chatBox.get(author).push({ message: message, isSender: isSender });
    } else {
      console.log("out");
      this.chatBox.set(author, [{ message: message, isSender: isSender }]);
    }
    //console.log(this.chatBox);
  }
  render(username) {
    if (this.chatBox.has(username)) {
      var sendMsg = `<div class="chats sender"><span>{msg}</span></div>`;
      var receivedMsg = `<div class="chats receiver"><span>{msg}</span></div>`;
      var chat = ``;
      var data = this.chatBox.get(username);
      console.log(data);

      for (let i of data) {
        if (i.isSender) {
          chat += sendMsg.replace(/\{msg}/g, i.message);
        } else {
          chat += receivedMsg.replace(/\{msg}/g, i.message);
        }
      }
      return chat;
    } else {
      return ``;
    }
  }
}
