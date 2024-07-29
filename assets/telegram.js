const TOKEN = "6805646450:AAFq58VGa-Gjwdf2cXj_mnrYNDrI0zZHY-k";
const CHAT_ID = "-1002171465668";
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
const URI_API_FILE = `https://api.telegram.org/bot${TOKEN}/sendDocument`;

document.addEventListener("DOMContentLoaded", () => {
  let formCall = document
    .querySelector(".mainForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      let firstName = document.querySelector("#first-name").value;
      let lastName = document.querySelector("#last-name").value;
      let request = document.querySelector("#request").value;
      let workTime = document.querySelector("#work-time").value;
      let streetAddress = document.querySelector("#street-address").value;
      let city = document.querySelector("#city").value;
      let zipCode = document.querySelector("#zip-code").value;
      let email = document.querySelector("#email").value;
      let phoneNumber = document.querySelector("#phone-number").value;
      let fileInput = document.querySelector("#file-upload");

      if (!!phoneNumber) {
        try {
          // Send the form data first
          const messageResponse = await axios.post(URI_API, {
            chat_id: CHAT_ID,
            parse_mode: "HTML",
            text: `Новая заявка с сайта
              Имя: ${firstName || "Не указано"} ${lastName || "Не указано"}
              Номер: ${phoneNumber || "Не указано"}
              Email: ${email || "Не указано"}
              Что нужно сделать: ${request || "Не указано"}
              Время выполнения работы: ${workTime || "Не указано"}
              Адрес: ${streetAddress || "Не указано"}, ${
              city || "Не указано"
            }, ${zipCode || "Не указано"}`,
          });

          if (messageResponse.status === 200) {
            // Send the file if there's one
            if (fileInput.files.length > 0) {
              let formData = new FormData();
              formData.append("chat_id", CHAT_ID);
              formData.append("document", fileInput.files[0]);

              const fileResponse = await axios.post(URI_API_FILE, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });

              if (fileResponse.status === 200) {
                document.querySelector("#request").value =
                  "Вы успешно оставили заявку";
              } else {
                console.error(
                  "Ошибка при отправке файла:",
                  fileResponse.statusText
                );
              }
            } else {
              document.querySelector("#request").value =
                "Вы успешно оставили заявку";
            }

            setTimeout(() => {
              document.querySelector("#first-name").value = "";
              document.querySelector("#last-name").value = "";
              document.querySelector("#request").value = "";
              document.querySelector("#work-time").value = "";
              document.querySelector("#street-address").value = "";
              document.querySelector("#city").value = "";
              document.querySelector("#zip-code").value = "";
              document.querySelector("#email").value = "";
              document.querySelector("#phone-number").value = "";
              fileInput.value = "";
              document.querySelector("body").style.overflow = "auto";
            }, 2000);
          }
        } catch (err) {
          console.error("Ошибка при отправке сообщения:", err);
        }
      } else {
        console.log("Заполните поля");
      }
    });
});
