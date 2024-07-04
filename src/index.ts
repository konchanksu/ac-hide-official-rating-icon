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

type LANGUAGE = 'EN' | 'JA';

const RATING_ICON_CLASSES = [
  'user-rating-stage-l',
  'user-rating-stage-m',
  'user-rating-stage-s',
];

const CURRENT_LANGUAGE: LANGUAGE = (() => {
  const dropdown_toggle = document.getElementsByClassName('dropdown-toggle');

  const isIncludeEn =
    Array.prototype.filter.call(dropdown_toggle, (element) =>
      element.textContent.includes('English'),
    ).length !== 0;

  return isIncludeEn ? ('EN' as LANGUAGE) : ('JA' as LANGUAGE); // default JA
})();

const IS_CURRENT_LANGUAGE_JA = CURRENT_LANGUAGE === 'JA';

const CONFIG_DROPDOWN = IS_CURRENT_LANGUAGE_JA
  ? ' ac-hide-icon 設定'
  : ' ac-hide-icon';

const MODAL_HTML = `<div id="modal-ac-hide-icon-settings" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
        <h4 class="modal-title">
          ${CONFIG_DROPDOWN}
        </h4>
      </div>
    <div class="modal-body">
      <div class="container-fluid">
        <div class="settings-row" class="row"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" data-dismiss="modal">close</button>
    </div>
  </div>
</div>`;

function hideIcons(): void {
  RATING_ICON_CLASSES.forEach((ratingIconClass: string) => {
    const ratingIcons: HTMLCollection =
      document.getElementsByClassName(ratingIconClass);

    Array.prototype.forEach.call(ratingIcons, (element) => {
      element.style.display = 'none';
    });
  });
}

function viewHeaderSetting(): void {
  const headerMyPageList = document.getElementsByClassName('dropdown-menu')[1];

  const newElement = createHeaderSettingElement();

  const positionIndex = 6;

  if (positionIndex >= headerMyPageList.children.length) {
    headerMyPageList.appendChild(newElement);
  } else {
    headerMyPageList.insertBefore(
      newElement,
      headerMyPageList.children[positionIndex],
    );
  }
}

function viewHeaderSettingInProfile(): void {
  const headerMyPageList = IS_CURRENT_LANGUAGE_JA
    ? document.getElementsByClassName('header-mypage_list')[0]
    : document.getElementsByClassName('dropdown-menu')[1];

  const newElement = createHeaderSettingElementInProfile();
  const positionIndex = IS_CURRENT_LANGUAGE_JA ? 5 : 6;

  if (headerMyPageList) {
    if (positionIndex >= headerMyPageList.children.length) {
      headerMyPageList.appendChild(newElement);
    } else {
      headerMyPageList.insertBefore(
        newElement,
        headerMyPageList.children[positionIndex],
      );
    }
  }
}

function createGlyphicon(): HTMLElement {
  const innerSpanTag = document.createElement('span');

  ['glyphicon', 'glyphicon-wrench'].forEach((tag) =>
    innerSpanTag.classList.add(tag),
  );

  return innerSpanTag;
}

function createIcon(): HTMLElement {
  const innerITag = document.createElement('i');

  ['a-icon', 'a-icon-setting'].forEach((tag) => innerITag.classList.add(tag));

  return innerITag;
}

function createHeaderATag(): HTMLElement {
  const aTag = document.createElement('a');
  const text = document.createTextNode(CONFIG_DROPDOWN);

  aTag.appendChild(text);
  aTag.setAttribute('data-toggle', 'modal');
  aTag.setAttribute('data-target', '#modal-ac-hide-icon-settings');

  return aTag;
}

function createModal() {
  document.querySelector('body')?.insertAdjacentHTML('afterbegin', MODAL_HTML);
}

function createHeaderSettingElement(): HTMLLIElement {
  const element = document.createElement('li');
  const innerATag = createHeaderATag();
  const innerSpanTag = createGlyphicon();

  element.appendChild(innerATag);
  innerATag.insertBefore(innerSpanTag, innerATag.firstChild);

  return element;
}

function createHeaderSettingElementInProfile(): HTMLLIElement {
  const element = document.createElement('li');
  const innerATag = createHeaderATag();
  const innerTag = IS_CURRENT_LANGUAGE_JA ? createIcon() : createGlyphicon();

  element.appendChild(innerATag);
  innerATag.insertBefore(innerTag, innerATag.firstChild);

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
  createModal();

  const url = window.location.href;

  if (url.match(/.*standings/g)) {
    observeLoadingHideClassForStandings();
  }

  if (url.match(/.*\/users\/.*/)) {
    viewHeaderSettingInProfile();
  } else {
    viewHeaderSetting();
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
