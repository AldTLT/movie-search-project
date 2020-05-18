const YANDEX_KEY = 'trnsl.1.1.20200421T062805Z.2cef3dc1edb6c1c6.90f85d80b46259a494f11441418c203de0eab93a';
const LANG = 'ru-en';
const URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';

// The function translates string from rus to eng
export default function translate(stringToTranslate) {
  const url = `${URL}key=${YANDEX_KEY}&text=${stringToTranslate}&lang=${LANG}`;
  return fetch(url)
    .then((response) => response.json());
}
