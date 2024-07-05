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

import {
  LocalStorageController,
  SHOW_RATING_ICON_FG,
} from './localStorageController';

type Language = 'EN' | 'JA';

type RadioButtonState = {
  title: string;
  id: string;
  showRatingIconFg: boolean;
  showRatingIconProfileFg: boolean;
};

const RATING_ICON_CLASSES = [
  'user-rating-stage-l',
  'user-rating-stage-m',
  'user-rating-stage-s',
];

const CURRENT_LANGUAGE: Language = (() => {
  const dropdown_toggle = document.getElementsByClassName('dropdown-toggle');

  const isIncludeEn =
    Array.prototype.filter.call(dropdown_toggle, (element) =>
      element.textContent.includes('English'),
    ).length !== 0;

  return isIncludeEn ? ('EN' as Language) : ('JA' as Language); // default JA
})();

const IS_CURRENT_LANGUAGE_JA = CURRENT_LANGUAGE === 'JA';

const CONFIG_DROPDOWN_JA: { title: string; radio: RadioButtonState[] } = {
  title: ' ac-hide-icon 設定',
  radio: [
    {
      title: 'レーティングアイコンを非表示にしない',
      id: 'any',
      showRatingIconFg: true,
      showRatingIconProfileFg: true,
    },
    {
      title: 'プロフィールページのみ非表示にする',
      id: 'only-not-standings',
      showRatingIconFg: true,
      showRatingIconProfileFg: false,
    },
    {
      title: 'レーティングアイコンを全て非表示にする',
      id: 'all',
      showRatingIconFg: false,
      showRatingIconProfileFg: false,
    },
  ],
};

const CONFIG_DROPDOWN_EN = {
  title: ' ac-hide-icon',
  showRatingIconFg: '',
};

const CONFIG_DROPDOWN = IS_CURRENT_LANGUAGE_JA
  ? CONFIG_DROPDOWN_JA
  : CONFIG_DROPDOWN_EN;

const MODAL_HTML_BASE = `<div id="modal-ac-hide-icon-settings" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
        <h4 class="modal-title">
          ${CONFIG_DROPDOWN['title']}
        </h4>
      </div>
    <div class="modal-body">
      <div class="container-fluid">
        <div class="settings-row row" id="ac-hide-rating-icon-radio">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" data-dismiss="modal">close</button>
    </div>
  </div>
</div>`;

const RADIO_HTML_BASE = (text: string, id: string): string =>
  `<div class="radio">
    <label>\
      <input type="radio" name="ac-hide-rating-icon-config" id="ac-hide-rating-icon-${id}" required> ${text}
    </label>
  </div>`;

const localStorageController = new LocalStorageController();

function isDropDownMenu() {
  return document.getElementsByClassName('dropdown-menu').length > 1;
}

function createCheckbox() {
  const radioState = localStorageController.getRadioState();

  CONFIG_DROPDOWN['radio'].forEach((element) => {
    const { title, id, showRatingIconFg, showRatingIconProfileFg } = element;
    const radio = RADIO_HTML_BASE(title, id);

    document
      .querySelector('#ac-hide-rating-icon-radio')
      ?.insertAdjacentHTML('afterbegin', radio);

    const currentRadio = document.getElementById(
      `ac-hide-rating-icon-${id}`,
    ) as HTMLInputElement;

    currentRadio.addEventListener('click', () => {
      localStorageController.saveRadioState({
        showRatingIconFg,
        showRatingIconProfileFg,
      });
      currentRadio.checked = true;
      checkAndHideIcons();
    });

    if (
      radioState['showRatingIconFg'] === showRatingIconFg &&
      radioState['showRatingIconProfileFg'] === showRatingIconProfileFg
    ) {
      currentRadio.checked = true;
    }
  });
}

function createModal() {
  document
    .querySelector('body')
    ?.insertAdjacentHTML('afterbegin', MODAL_HTML_BASE);

  createCheckbox();
}

function controlIcons(hideFg: boolean): void {
  RATING_ICON_CLASSES.forEach((ratingIconClass: string) => {
    const ratingIcons: HTMLCollection =
      document.getElementsByClassName(ratingIconClass);

    Array.prototype.forEach.call(ratingIcons, (element) => {
      element.style.display = hideFg ? 'none' : 'unset';
    });
  });
}

function showHeaderSettingForDropDown(): void {
  const headerMyPageList = document.getElementsByClassName('dropdown-menu')[1];
  const newElement = createHeaderSettingElementForDropDown();

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

function showHeaderSetting(): void {
  const headerMyPageList =
    document.getElementsByClassName('header-mypage_list')[0];

  const newElement = createHeaderSettingElement();
  const positionIndex = 5;

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
  const text = document.createTextNode(CONFIG_DROPDOWN['title']);

  aTag.appendChild(text);
  aTag.setAttribute('data-toggle', 'modal');
  aTag.setAttribute('data-target', '#modal-ac-hide-icon-settings');

  return aTag;
}

function createHeaderSettingElementForDropDown(): HTMLLIElement {
  const element = document.createElement('li');
  const innerATag = createHeaderATag();
  const innerSpanTag = createGlyphicon();

  element.appendChild(innerATag);
  innerATag.insertBefore(innerSpanTag, innerATag.firstChild);

  return element;
}

function createHeaderSettingElement(): HTMLLIElement {
  const element = document.createElement('li');
  const innerATag = createHeaderATag();
  const innerTag = IS_CURRENT_LANGUAGE_JA ? createIcon() : createGlyphicon();

  element.appendChild(innerATag);
  innerATag.insertBefore(innerTag, innerATag.firstChild);

  return element;
}

function observeLoadingHideClassForStandings(hide: boolean): void {
  const target = document.getElementsByClassName('loading-hide');

  if (target) {
    const observer = new MutationObserver(() => {
      // 読み込み後は standings-tbody に順位情報が格納されるため、それを参照する
      observeStandings(hide);
      controlIcons(hide);
    });
    observer.observe(target[1], {
      childList: true,
    });
    observeStandings(hide);
  }
}

function observeStandings(hide: boolean): void {
  const target = document.getElementById('standings-tbody');

  if (target) {
    const observer = new MutationObserver(() => {
      controlIcons(hide);
    });
    observer.observe(target, {
      childList: true,
    });
  }
}

function checkAndHideIcons(): void {
  const { showRatingIconFg, showRatingIconProfileFg } =
    localStorageController.getRadioState();
  const url = window.location.href;

  controlIcons(
    !showRatingIconFg || (url.match(/.*users.*/) && !showRatingIconProfileFg),
  );

  if (url.match(/.*standings/g)) {
    observeLoadingHideClassForStandings(showRatingIconFg);
  }
}

function main(): void {
  checkAndHideIcons();

  // 設定作る系
  createModal();
  if (isDropDownMenu()) {
    showHeaderSettingForDropDown();
  } else {
    showHeaderSetting();
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
