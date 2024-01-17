import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [word, setWord] = useState("");
  // const [playingFile, setPlayingFile] = useState(0);
  const [celda, setCelda] = useState(0);
  const tableroRef = useRef([]).current;

  useEffect(() => {
    fetch("https://random-word-api.herokuapp.com/word?length=5")
      .then((response) => response.body)
      .then((rb) => {
        const reader = rb.getReader();

        return new ReadableStream({
          start(controller) {
            // The following function handles each data chunk
            function push() {
              // "done" is a Boolean and value a "Uint8Array"
              reader.read().then(({ done, value }) => {
                // If there is no more data to read
                if (done) {
                  controller.close();
                  return;
                }
                // Get the data and send it to the browser via the controller
                controller.enqueue(value);

                push();
              });
            }

            push();
          },
        });
      })
      .then((stream) =>
        // Respond with our stream
        new Response(stream, {
          headers: { "Content-Type": "text/html" },
        }).text()
      )
      .then((result) => {
        // Do things with result
        setWord(
          result
            .replace("[", "")
            .replace("]", "")
            .replace('"', "")
            .replace('"', "")
        );
        // let regex =
        //   /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s[a-zA-ZÀ-ÿ\u00f1\u00d1])*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
        // return regex.exec(nombre)[0];
      })
      .catch((error) => console.log("Error", error));
  }, []);

  const teclado = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["ENVIAR", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
  ];

  const handleClick = ({ target }) => {
    console.log(target.textContent);
    const tablero = tableroRef.filter((celda, index) => index <= 24);
    console.log(">>>", tablero[0]);
    console.log("CELDA", celda);

    if (tablero[celda].value.toUpperCase() === target.textContent) {
      tablero[celda].value = target.textContent;
      tablero[celda].style.backgroundColor = "green";
    } else if (word.toUpperCase().includes(target.textContent)) {
      tablero[celda].value = target.textContent;
      tablero[celda].style.backgroundColor = "yellow";
    } else tablero[celda].value = target.textContent;

    tablero[celda].style.display = "block";
    /**
     *  Que estto no es siempre asi hay veces que necesitamos dos vocales o dos letras
     *  target.disabled = true
     */
    if (!word.toUpperCase().includes(target.textContent))
      target.disabled = true;
    // tableroRef.current.firstElementChild.innerText = target.textContent
    setCelda(celda + 1);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItem: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <p>{word}</p>
      <div style={{ width: "500px", height: "500px", alignSelf: "center" }}>
        {word.length > 0 &&
          [1, 2, 3, 4, 5].map((elemt) => {
            return (
              <div
                key={elemt}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",

                  gap: "0.2rem",
                  paddingTop: "0.2rem",
                }}
              >
                {word.split("").map((elem, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        color: "red",
                        width: "80px",
                        height: "80px",
                        border: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        value={elem}
                        autoFocus={index == 0}
                        onChange={() => console.log('me pinto')}
                        ref={(e) => tableroRef.push(e)}
                        id={`${elemt}-${elem}`}
                        style={{ display: "none", border: "1px solid red" }}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",

          marginTop: "3px",
          height: "600px",
        }}
      >
        {teclado.map((fila, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                width: "900px",
                height: "100px",
                gap: "0.2rem",
                alignSelf: "center",
              }}
            >
              {fila.map((boton) => {
                let dynamicStyle = { width: "90px" };
                if (boton.includes("ENVIAR") || boton.includes("DELETE")) {
                  dynamicStyle = { flex: 1 };
                }
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid green",
                      ...dynamicStyle,
                      height: "90px",
                      alignSelf: "center",
                      gap: "0.2rem",
                    }}
                    key={boton}
                  >
                    <button
                      onClick={handleClick}
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                        fontSize: "1.5rem",
                      }}
                    >
                      {boton}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
