import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
  const [response, setResponse] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordedSpeech, setRecordedSpeech] = useState("");
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([]);

  const recognition = new window.webkitSpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = "ur-PK";

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("");

    setRecordedSpeech(transcript);
    setTextInput(transcript);
  };

  const handleServerResponse = (response) => {
    setMessages([...messages, { type: "bot", text: response }]);
  };

  const handleStartRecording = () => {
    setTextInput("");
    setRecordedSpeech("");
    setRecording(true);
    recognition.start();
  };

  const handleStopRecording = () => {
    setRecording(false);
    recognition.stop();
    console.log("sending to server");
    handleSendSpeech();
    console.log("sent to server");
  };

  const handleSendSpeech = () => {
    axios
      .post("http://127.0.0.1:5000/process_speech", { speech: recordedSpeech })
      .then((response) => {
        console.log("Server Response:", response.data.response);
        handleServerResponse(response.data.response);
        setResponse(response.data.response);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSendTextMessage = () => {
    if (textInput.trim() !== "") {
      const newUserMessage = { type: "user", text: textInput };
      const newBotMessage = { type: "bot", text: response };
  
      setMessages([...messages, newUserMessage, newBotMessage]);
  
      setTextInput("");
    }
  };


  const fetchStory = () => {
      var story = "ایک دن ایک کوا چھت پر بیٹھا ہوا تھا۔ دن کے گرمی سے کوا بہت پیاسا ہوگیا۔ اچانک ایک کھولے ہوئے پانی کی گہری گڑھا ملی۔ کوآ نے دیکھا کہ گڑھے میں پانی بہت نیچے ہے اور اس تک پہنچنے کے لئے وہاں پہنچنے کے لئے گہرے کھائی کی ضرورت پڑے گی۔ کوآ کو پانی کی شدت سے دلی سمجھ آگئی اور اس نے فوراً فوراً چار-پانچ چھتیں ماریں تاکہ پانی بلند ہوجائے اور وہ پیاس بجھا سکے۔ لیکن اس کی کوششوں سے بھی گہری گڑھے کی بلندی کم نہ ہو سکی۔ کوآ ہر دفعہ پیاس سے تڑپ رہا تھا۔   تب اچانک ایک آلوچے کی تھیلی اُس کے نزدیک آئی جس میں چھوٹا سا پانی کا گڑھا تھا۔ کوآ نے خوشی سے دیکھا اور اپنے دوستوں کو بلانے لگا۔ کوآ نے تھیلی کے کھچے کوچے پانی کو اچھالا اور دیکھا کہ پانی کی موج اوپر جا رہی ہے۔ کوآ نے اب مزید چھتیں ماریں اور پانی بھرا گڑھا نیچے ہلکا ہوا۔ کوآ نے اب آسانی سے پانی کو پہنچا اور پیاس بجھا دی۔ اب کوآ نے اپنے دوستوں کا شکریہ ادا کیا جو اس کی مدد کر کے اس کی پیاس بجھا دی۔ اس داستان سے ہمیں یہ سبق ملتا ہے کہ محنت اور ثابت قدمی سے مشکلات کو آسانی سے مقابلہ کیا جاسکتا ہے۔ ہمیشہ حلقہ دار روشنی کا انتظام کرنا چاہئے تاکہ آنے والی نسل کو بھی ہمارے ان جیون مشقتوں کا مثال ملے۔ اسی طرح اچھے کاموں کی تلاش میں کبھی بھی مایوس نہیں ہونا چاہئے۔ اگر ہم جذبہ، لگن اور تواضع سے کام لیں تو ہم ہمیشہ کامیاب ہوں گے۔"
      console.log(story) ;

      axios
      .post("http://127.0.0.1:5000/storyqa", { story: story })
      .then((response) => {
        console.log("Server Response:", response.data.response);
        handleServerResponse(response.data.response);
        setResponse(response.data.response);
      })
      .catch((error) => console.error("Error:", error));
  };    
  

  return (
    <div>
    <section className="avenue-messenger">
      <div className="menu">
        <div className="items">
          <span>
            <a href="#" title="Minimize">
              &mdash;
            </a>
            <br />
            <a href="#" title="End Chat">&#10005;</a>
          </span>
        </div>
        <div className="button">...</div>
      </div>
      <div className="agent-face">
        <div className="half"></div>
      </div>
      <div className="chat">
        <h1>گفتگو</h1>
        <div className="messages">
          <div className="messages-content">
            {messages.map((message, index) => (
              <p key={index} className={`message ${message.type}`}>
                {message.text}
              </p>
            ))}
          </div>
        </div>
        <div className="message-box">
          <textarea
            type="text"
            className="message-input"
            placeholder="Type message..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          ></textarea>
        </div>
        <div className="test">
          <button onClick={handleSendTextMessage}>Send</button>
          {recording ? (
            <button onClick={handleStopRecording}>Stop recording</button>
          ) : (
            <button onClick={handleStartRecording}>Start recording</button>
          )}
        </div>
      </div>
    </section>
    <div className= "cues">
          <button onClick={fetchStory}>cue for q/a story</button>
          <button> game cue</button>
          <button> system initiated </button>

        </div>
    </div>
  );
}

export default App;
