// ==UserScript==
// @name         新規スクリプト
// @namespace    https://atcoder.jp/
// @version      0.1
// @description  AtCoder公式のレーティングアイコンを非表示にできるようにする拡張機能
// @author       konchanksu
// @match        https://atcoder.jp/*
// @grant        none
// ==/UserScript==

//ac-hide-official-rating-icon

const RATING_ICON_CLASSES = [
  'user-rating-stage-l',
  'user-rating-stage-m',
  'user-rating-stage-s',
];

function hideIcons(): void {
  RATING_ICON_CLASSES.forEach((ratingIconClass: string) => {
    const ratingIcons: HTMLCollection =
      document.getElementsByClassName(ratingIconClass);

    Array.prototype.forEach.call(ratingIcons, (element) => {
      element.style.display = 'none';
    });
  });
}

function viewHeaderSettingInProfile(): void {
  const headerMyPageList =
    document.getElementsByClassName('header-mypage_list')[0];

  const newElement = createHeaderSettingElement();

  const positionIndex = 5;

  if (positionIndex >= headerMyPageList.children.length) {
    headerMyPageList.appendChild(newElement);
  } else {
    headerMyPageList.insertBefore(
      newElement,
      headerMyPageList.children[positionIndex],
    );
  }
}

function createHeaderSettingElement(): HTMLLIElement {
  const element = document.createElement('li');
  const innerATag = document.createElement('a');
  const innerITag = document.createElement('i');
  const text = document.createTextNode(' ac-hide-icon 設定');

  element.appendChild(innerATag);
  innerATag.appendChild(innerITag);
  innerATag.appendChild(text);

  ['a-icon', 'a-icon-setting'].forEach((tag) => innerITag.classList.add(tag));

  return element;
}

function observeLoadingHideClassForStandings() {
  const target = document.getElementsByClassName('loading-hide');

  if (target) {
    const observer = new MutationObserver(() => {
      // 読み込み後は standings-tbody に順位情報が格納されるため、それを参照する
      observeStandings();
      hideIcons();
    });
    observer.observe(target[1], {
      childList: true,
    });
    observeStandings();
  }
}

function observeStandings() {
  const target = document.getElementById('standings-tbody');

  if (target) {
    const observer = new MutationObserver(() => {
      hideIcons();
    });
    observer.observe(target, {
      childList: true,
    });
  }
}

function main() {
  hideIcons();

  const url = window.location.href;

  if (url.match(/.*standings/g)) {
    observeLoadingHideClassForStandings();
  }

  if (url.match(/.*\/users\/.*/)) {
    viewHeaderSettingInProfile();
  }
}

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => main());
  } else {
    main();
  }
})();
