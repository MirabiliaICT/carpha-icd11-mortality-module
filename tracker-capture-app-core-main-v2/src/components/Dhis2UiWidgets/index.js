/* eslint-disable */
import _JSXStyle from "styled-jsx/style";
import React, { useMemo, useState, useEffect } from "react";
import propTypes from "@dhis2/prop-types";
import {
  colors,
  Card,
  InputField,
  theme,
  Divider,
  MenuItem,
  LogoIconWhite,
  spacers,
  Checkbox,
  Node,
  CircularLoader
} from "@dhis2/ui-core";
import { useConfig, useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import propTypes$1 from "prop-types";
import cx from "classnames";

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function Settings({ className }) {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "48",
      height: "48",
      viewBox: "0 0 48 48",
      className: className
    },
    React.createElement("path", {
      d: "M0 0h48v48H0z",
      fill: "none"
    }),
    React.createElement("path", {
      d:
        "M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97L29 4.84c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97L9.9 10.1c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31C9.06 22.69 9 23.34 9 24s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zM24 31c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
    })
  );
}
Settings.propTypes = {
  className: propTypes.string
};

function Apps({ className }) {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "48",
      height: "48",
      viewBox: "0 0 48 48",
      className: className
    },
    React.createElement("path", {
      d:
        "M8 16h8V8H8v8zm12 24h8v-8h-8v8zM8 40h8v-8H8v8zm0-12h8v-8H8v8zm12 0h8v-8h-8v8zM32 8v8h8V8h-8zm-12 8h8V8h-8v8zm12 12h8v-8h-8v8zm0 12h8v-8h-8v8z"
    }),
    React.createElement("path", {
      d: "M0 0h48v48H0z",
      fill: "none"
    })
  );
}
Apps.propTypes = {
  className: propTypes.string
};

function Cancel({ className }) {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "48",
      height: "48",
      viewBox: "0 0 48 48",
      className: className
    },
    React.createElement("path", {
      d:
        "M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm10 27.17L31.17 34 24 26.83 16.83 34 14 31.17 21.17 24 14 16.83 16.83 14 24 21.17 31.17 14 34 16.83 26.83 24 34 31.17z"
    }),
    React.createElement("path", {
      d: "M0 0h48v48H0z",
      fill: "none"
    })
  );
}
Cancel.propTypes = {
  className: propTypes.string
};

const joinPath = (...parts) => {
  const realParts = parts.filter((part) => !!part);
  return realParts.map((part) => part.replace(/^\/+|\/+$/g, "")).join("/");
};

const appIcon = {
  styles: React.createElement(
    _JSXStyle,
    {
      id: "3410460782"
    },
    ["svg.jsx-3410460782{fill:".concat(colors.white, ";cursor:pointer;height:24px;width:24px;}")]
  ),
  className: "jsx-3410460782"
};
const trailIcon = {
  styles: React.createElement(
    _JSXStyle,
    {
      id: "2579680111"
    },
    [
      "svg.jsx-2579680111{fill:".concat(
        colors.grey900,
        ";cursor:pointer;height:24px;width:24px;margin-right:8px;margin-top:4px;}"
      )
    ]
  ),
  className: "jsx-2579680111"
};
const settingsIcon = {
  styles: React.createElement(
    _JSXStyle,
    {
      id: "2948778822"
    },
    [
      "svg.jsx-2948778822{margin:8px 8px 0 16px;color:".concat(
        colors.grey900,
        ";height:24px;width:24px;cursor:pointer;}"
      )
    ]
  ),
  className: "jsx-2948778822"
};

function TrailIcon({ onClick }) {
  return React.createElement(
    "a",
    {
      onClick: onClick
    },
    React.createElement(Cancel, {
      className: trailIcon.className
    })
  );
}

TrailIcon.propTypes = {
  onClick: propTypes.func
};

function Search({ value, onChange, onIconClick }) {
  const { baseUrl } = useConfig();
  return React.createElement(
    "div",
    {
      className: "jsx-2764723183"
    },
    React.createElement(
      "span",
      {
        className: "jsx-2764723183"
      },
      React.createElement(InputField, {
        value: value,
        name: "filter",
        placeholder: i18n.t("Search apps"),
        onChange: onChange,
        trailIcon: React.createElement(TrailIcon, {
          onClick: onIconClick
        }),
        initialFocus: true
      })
    ),
    React.createElement(
      "span",
      {
        className: "jsx-2764723183"
      },
      React.createElement(
        "a",
        {
          href: joinPath(baseUrl, "dhis-web-menu-management"),
          className: "jsx-2764723183"
        },
        React.createElement(Settings, {
          className: settingsIcon.className
        })
      )
    ),
    trailIcon.styles,
    settingsIcon.styles,
    React.createElement(
      _JSXStyle,
      {
        id: "2764723183"
      },
      [
        "div.jsx-2764723183{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;height:52px;margin:8px;}",
        "span.jsx-2764723183{-webkit-flex:1 100%;-ms-flex:1 100%;flex:1 100%;}",
        "span.jsx-2764723183:last-child{-webkit-flex:1 auto;-ms-flex:1 auto;flex:1 auto;}"
      ]
    )
  );
}

Search.defaultProps = {
  onIconClick: null
};
Search.propTypes = {
  value: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  onIconClick: propTypes.func
};

function Item({ name, path, img }) {
  return React.createElement(
    "a",
    {
      href: path,
      className: _JSXStyle.dynamic([["3643539777", [theme.primary050]]])
    },
    React.createElement("img", {
      src: img,
      alt: "app logo",
      className: _JSXStyle.dynamic([["3643539777", [theme.primary050]]])
    }),
    React.createElement(
      "div",
      {
        className: _JSXStyle.dynamic([["3643539777", [theme.primary050]]])
      },
      name
    ),
    React.createElement(
      _JSXStyle,
      {
        id: "3643539777",
        dynamic: [theme.primary050]
      },
      [
        "a.__jsx-style-dynamic-selector{display:inline-block;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;width:96px;margin:8px;padding:8px;border-radius:12px;-webkit-text-decoration:none;text-decoration:none;cursor:pointer;}",
        "a.__jsx-style-dynamic-selector:hover,a.__jsx-style-dynamic-selector:focus{background-color:".concat(
          theme.primary050,
          ";cursor:pointer;}"
        ),
        "a.__jsx-style-dynamic-selector:hover>div.__jsx-style-dynamic-selector{font-weight:500;cursor:pointer;}",
        "img.__jsx-style-dynamic-selector{width:48px;height:48px;cursor:pointer;}",
        "div.__jsx-style-dynamic-selector{margin-top:14px;color:rgba(0,0,0,0.87);font-size:12px;-webkit-letter-spacing:0.01em;-moz-letter-spacing:0.01em;-ms-letter-spacing:0.01em;letter-spacing:0.01em;line-height:14px;text-align:center;cursor:pointer;}"
      ]
    )
  );
}

Item.propTypes = {
  img: propTypes.string,
  name: propTypes.string,
  path: propTypes.string
};
/**
 * Copied from here:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
 */

function escapeRegExpCharacters(text) {
  return text.replace(/[/.*+?^${}()|[\]\\]/g, "\\$&");
}

function List({ apps, filter }) {
  return React.createElement(
    "div",
    {
      "data-test": "headerbar-apps-menu-list",
      className: "jsx-2076871745"
    },
    apps
      .filter(({ displayName, name }) => {
        const appName = displayName || name;
        const formattedAppName = appName.toLowerCase();
        const formattedFilter = escapeRegExpCharacters(filter).toLowerCase();
        return filter.length > 0 ? formattedAppName.match(formattedFilter) : true;
      })
      .map(({ displayName, name, defaultAction, icon }, idx) =>
        React.createElement(Item, {
          key: "app-".concat(name, "-").concat(idx),
          name: displayName || name,
          path: defaultAction,
          img: icon
        })
      ),
    React.createElement(
      _JSXStyle,
      {
        id: "2076871745"
      },
      [
        "div.jsx-2076871745{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-align-content:flex-start;-ms-flex-line-pack:start;align-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:30vw;min-width:300px;max-width:560px;min-height:200px;max-height:465px;margin:0 8px 8px 8px;overflow:auto;overflow-x:hidden;}"
      ]
    )
  );
}

List.propTypes = {
  apps: propTypes.array,
  filter: propTypes.string
};
class Apps$1 extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      show: false,
      filter: ""
    });

    _defineProperty(this, "onDocClick", (evt) => {
      if (this.elContainer && !this.elContainer.contains(evt.target)) {
        this.setState({
          show: false
        });
      }
    });

    _defineProperty(this, "onToggle", () =>
      this.setState({
        show: !this.state.show
      })
    );

    _defineProperty(this, "onChange", ({ value }) =>
      this.setState({
        filter: value
      })
    );

    _defineProperty(this, "onIconClick", () =>
      this.setState({
        filter: ""
      })
    );

    _defineProperty(this, "AppMenu", (apps) =>
      React.createElement(
        "div",
        {
          "data-test": "headerbar-apps-menu",
          className: "jsx-1740460911"
        },
        React.createElement(
          Card,
          null,
          React.createElement(Search, {
            value: this.state.filter,
            onChange: this.onChange,
            onIconClick: this.onIconClick
          }),
          React.createElement(List, {
            apps: apps,
            filter: this.state.filter
          })
        ),
        React.createElement(
          _JSXStyle,
          {
            id: "1740460911"
          },
          ["div.jsx-1740460911{z-index:10000;position:absolute;top:28px;right:-6px;border-top:4px solid transparent;}"]
        )
      )
    );
  }

  componentDidMount() {
    document.addEventListener("click", this.onDocClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onDocClick);
  }

  render() {
    const apps = this.props.apps;
    return React.createElement(
      "div",
      {
        ref: (c) => (this.elContainer = c),
        "data-test": "headerbar-apps",
        className: "jsx-1265754857"
      },
      React.createElement(
        "a",
        {
          onClick: this.onToggle,
          "data-test": "headerbar-apps-icon",
          className: "jsx-1265754857"
        },
        React.createElement(Apps, {
          className: appIcon.className
        })
      ),
      this.state.show && this.AppMenu(apps),
      appIcon.styles,
      React.createElement(
        _JSXStyle,
        {
          id: "1265754857"
        },
        [
          "a.jsx-1265754857{display:block;}",
          "div.jsx-1265754857{position:relative;width:24px;height:30px;margin:8px 0 0 0;}"
        ]
      )
    );
  }
}
Apps$1.propTypes = {
  apps: propTypes.array.isRequired
};

function Info({ className }) {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "48",
      height: "48",
      viewBox: "0 0 48 48",
      className: className
    },
    React.createElement("path", {
      d: "M0 0h48v48H0z",
      fill: "none"
    }),
    React.createElement("path", {
      d: "M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 30h-4V22h4v12zm0-16h-4v-4h4v4z"
    })
  );
}
Info.propTypes = {
  className: propTypes.string
};

function Help({ className }) {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "48",
      height: "48",
      viewBox: "0 0 48 48",
      className: className
    },
    React.createElement("path", {
      d: "M0 0h48v48H0z",
      fill: "none"
    }),
    React.createElement("path", {
      d:
        "M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 34h-4v-4h4v4zm4.13-15.49l-1.79 1.84C26.9 25.79 26 27 26 30h-4v-1c0-2.21.9-4.21 2.34-5.66l2.49-2.52C27.55 20.1 28 19.1 28 18c0-2.21-1.79-4-4-4s-4 1.79-4 4h-4c0-4.42 3.58-8 8-8s8 3.58 8 8c0 1.76-.71 3.35-1.87 4.51z"
    })
  );
}
Help.propTypes = {
  className: propTypes.string
};

function Exit({ className }) {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "48",
      height: "48",
      viewBox: "0 0 48 48",
      className: className
    },
    React.createElement("path", {
      d: "M0 0h48v48H0z",
      fill: "none"
    }),
    React.createElement("path", {
      d:
        "M20.17 31.17L23 34l10-10-10-10-2.83 2.83L25.34 22H6v4h19.34l-5.17 5.17zM38 6H10c-2.21 0-4 1.79-4 4v8h4v-8h28v28H10v-8H6v8c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4z"
    })
  );
}
Exit.propTypes = {
  className: propTypes.string
};

function Account({ className }) {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "48",
      height: "48",
      viewBox: "0 0 48 48",
      className: className
    },
    React.createElement("path", {
      d:
        "M6 10v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4H10c-2.21 0-4 1.79-4 4zm24 8c0 3.32-2.69 6-6 6s-6-2.68-6-6c0-3.31 2.69-6 6-6s6 2.69 6 6zM12 34c0-4 8-6.2 12-6.2S36 30 36 34v2H12v-2z"
    }),
    React.createElement("path", {
      d: "M0 0h48v48H0z",
      fill: "none"
    })
  );
}
Account.propTypes = {
  className: propTypes.string
};

const TextIcon = ({ name, onClick, dataTestId }) => {
  let title = name[0];

  if (name.indexOf(" ") > 0) {
    title += name.split(" ")[1][0];
  }

  return React.createElement(
    "div",
    {
      onClick: onClick,
      "data-test": dataTestId,
      className: "jsx-1795768421"
    },
    React.createElement(
      "p",
      {
        className: "jsx-1795768421"
      },
      title
    ),
    React.createElement(
      _JSXStyle,
      {
        id: "1795768421"
      },
      [
        "div.jsx-1795768421{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;width:36px;height:36px;overflow:hidden;border-radius:50%;background-color:rgba(0,0,0,0.3);color:#fff;cursor:pointer;}",
        "p.jsx-1795768421{font-size:14px;font-weight:500;-webkit-letter-spacing:1px;-moz-letter-spacing:1px;-ms-letter-spacing:1px;letter-spacing:1px;text-align:center;text-transform:uppercase;}"
      ]
    )
  );
};
TextIcon.defaultProps = {
  onClick: undefined
};
TextIcon.propTypes = {
  name: propTypes.string.isRequired,
  dataTestId: propTypes.string,
  onClick: propTypes.func
};

const ImageIcon = ({ src, onClick, dataTestId }) =>
  React.createElement(
    "div",
    {
      onClick: onClick,
      "data-test": dataTestId,
      className: "jsx-4170436681"
    },
    React.createElement("img", {
      src: src,
      alt: "user avatar",
      className: "jsx-4170436681"
    }),
    React.createElement(
      _JSXStyle,
      {
        id: "4170436681"
      },
      ["img.jsx-4170436681{max-width:100%;max-height:100%;}", "div.jsx-4170436681{width:48px;height:48px;}"]
    )
  );
ImageIcon.defaultProps = {
  onClick: undefined
};
ImageIcon.propTypes = {
  src: propTypes.string.isRequired,
  dataTestId: propTypes.string,
  onClick: propTypes.func
};

const ProfileName = ({ children }) =>
  React.createElement(
    "div",
    {
      "data-test": "headerbar-profile-username",
      className: "jsx-2223023701"
    },
    children,
    React.createElement(
      _JSXStyle,
      {
        id: "2223023701"
      },
      ["div.jsx-2223023701{margin-bottom:3px;font-size:16px;line-height:19px;}"]
    )
  );

ProfileName.propTypes = {
  children: propTypes.string
};

const ProfileEmail = ({ children }) =>
  React.createElement(
    "div",
    {
      "data-test": "headerbar-profile-user-email",
      className: "jsx-1072768994"
    },
    children,
    React.createElement(
      _JSXStyle,
      {
        id: "1072768994"
      },
      ["div.jsx-1072768994{margin-bottom:6px;font-size:14px;line-height:16px;}"]
    )
  );

ProfileEmail.propTypes = {
  children: propTypes.string
};

const ProfileEdit = ({ children }) => {
  const { baseUrl } = useConfig();
  return React.createElement(
    "a",
    {
      href: joinPath(baseUrl, "dhis-web-user-profile/#/profile"),
      "data-test": "headerbar-profile-edit-profile-link",
      className: "jsx-233684196"
    },
    children,
    React.createElement(
      _JSXStyle,
      {
        id: "233684196"
      },
      [
        "a.jsx-233684196{color:rgba(0,0,0,0.87);font-size:12px;line-height:14px;-webkit-text-decoration:underline;text-decoration:underline;cursor:pointer;}"
      ]
    )
  );
};

ProfileEdit.propTypes = {
  children: propTypes.string
};

const ProfileDetails = ({ name, email }) =>
  React.createElement(
    "div",
    {
      className: "jsx-3814112749"
    },
    React.createElement(ProfileName, null, name),
    React.createElement(ProfileEmail, null, email),
    React.createElement(ProfileEdit, null, i18n.t("Edit profile")),
    React.createElement(
      _JSXStyle,
      {
        id: "3814112749"
      },
      [
        "div.jsx-3814112749{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;margin-left:20px;color:#000;font-size:14px;font-weight:400;}"
      ]
    )
  );

ProfileDetails.propTypes = {
  email: propTypes.string,
  name: propTypes.string
};
const ProfileHeader = ({ name, email, img }) =>
  React.createElement(
    "div",
    {
      className: "jsx-3625287538"
    },
    img
      ? React.createElement(ImageIcon, {
          src: img
        })
      : React.createElement(TextIcon, {
          name: name
        }),
    React.createElement(ProfileDetails, {
      name: name,
      email: email
    }),
    React.createElement(
      _JSXStyle,
      {
        id: "3625287538"
      },
      [
        "div.jsx-3625287538{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;margin-left:24px;padding-top:20px;}"
      ]
    )
  );
ProfileHeader.propTypes = {
  email: propTypes.string,
  img: propTypes.string,
  name: propTypes.string
};

const iconStyle = {
  styles: React.createElement(
    _JSXStyle,
    {
      id: "84293854"
    },
    ["svg.jsx-84293854{fill:".concat(colors.grey700, ";cursor:pointer;height:24px;width:24px;}")]
  ),
  className: "jsx-84293854"
};

const getMenuList = () => [
  {
    icon: React.createElement(Settings, {
      className: iconStyle.className
    }),
    label: i18n.t("Settings"),
    value: "settings",
    link: "dhis-web-user-profile/#/settings"
  },
  {
    icon: React.createElement(Account, {
      className: iconStyle.className
    }),
    label: i18n.t("Account"),
    value: "account",
    link: "dhis-web-user-profile/#/account"
  },
  {
    icon: React.createElement(Help, {
      className: iconStyle.className
    }),
    label: i18n.t("Help"),
    value: "help",
    link: "https://docs.dhis2.org/master/en/user/html/dhis2_user_manual_en.html",
    nobase: true
  },
  {
    icon: React.createElement(Info, {
      className: iconStyle.className
    }),
    label: i18n.t("About DHIS2"),
    value: "about",
    link: "dhis-web-user-profile/#/aboutPage"
  },
  {
    icon: React.createElement(Exit, {
      className: iconStyle.className
    }),
    label: i18n.t("Logout"),
    value: "logout",
    link: "dhis-web-commons-security/logout.action"
  }
];

const ProfileContents = ({ name, email, avatar }) => {
  const { baseUrl } = useConfig();
  return React.createElement(
    Card,
    null,
    React.createElement(
      "div",
      {
        className: "jsx-2099675810"
      },
      React.createElement(ProfileHeader, {
        name: name,
        email: email,
        img: avatar
      }),
      React.createElement(Divider, {
        margin: "13px 0 7px 0"
      }),
      React.createElement(
        "ul",
        {
          "data-test": "headerbar-profile-menu",
          className: "jsx-2099675810"
        },
        getMenuList().map(({ label, value, icon, link, nobase }) =>
          React.createElement(MenuItem, {
            href: nobase ? link : joinPath(baseUrl, link),
            key: "h-mi-".concat(value),
            label: label,
            value: value,
            icon: icon
          })
        )
      )
    ),
    iconStyle.styles,
    React.createElement(
      _JSXStyle,
      {
        id: "2099675810"
      },
      [
        "div.jsx-2099675810{width:100%;padding:0;}",
        "ul.jsx-2099675810{padding:0;margin:0;}",
        "a.jsx-2099675810,a.jsx-2099675810:hover,a.jsx-2099675810:focus,a.jsx-2099675810:active,a.jsx-2099675810:visited{-webkit-text-decoration:none;text-decoration:none;display:block;}"
      ]
    )
  );
};

ProfileContents.propTypes = {
  avatar: propTypes.element,
  email: propTypes.string,
  name: propTypes.string
};
const ProfileMenu = ({ avatar, name, email }) =>
  React.createElement(
    "div",
    {
      "data-test": "headerbar-profile-menu",
      className: "jsx-3620236321"
    },
    React.createElement(ProfileContents, {
      name: name,
      email: email,
      avatar: avatar
    }),
    React.createElement(
      _JSXStyle,
      {
        id: "3620236321"
      },
      [
        "div.jsx-3620236321{z-index:10000;position:absolute;top:34px;right:-6px;width:310px;border-top:4px solid transparent;}"
      ]
    )
  );
ProfileMenu.propTypes = {
  avatar: propTypes.element,
  email: propTypes.string,
  name: propTypes.string
};

function avatarPath(avatar, baseUrl) {
  if (!avatar) {
    return null;
  }

  return joinPath(baseUrl, "api/fileResources", avatar.id, "data");
}

class Profile extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      show: false
    });

    _defineProperty(this, "onDocClick", (evt) => {
      if (this.elContainer && !this.elContainer.contains(evt.target)) {
        this.setState({
          show: false
        });
      }
    });

    _defineProperty(this, "onToggle", () =>
      this.setState({
        show: !this.state.show
      })
    );
  }

  componentDidMount() {
    document.addEventListener("click", this.onDocClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onDocClick);
  }

  userIcon(me, baseUrl) {
    const avatar = avatarPath(me.avatar, baseUrl);

    if (avatar) {
      return React.createElement(ImageIcon, {
        src: avatar,
        onClick: this.onToggle,
        dataTestId: "headerbar-profile-icon-image"
      });
    }

    return React.createElement(TextIcon, {
      name: me.name,
      onClick: this.onToggle,
      dataTestId: "headerbar-profile-icon-text"
    });
  }

  render() {
    const { user, baseUrl } = this.props;
    return React.createElement(
      "div",
      {
        ref: (c) => (this.elContainer = c),
        "data-test": "headerbar-profile",
        className: "jsx-661915851"
      },
      this.userIcon(user, baseUrl),
      this.state.show
        ? React.createElement(ProfileMenu, {
            avatar: avatarPath(user.avatar, baseUrl),
            name: user.name,
            email: user.email
          })
        : null,
      React.createElement(
        _JSXStyle,
        {
          id: "661915851"
        },
        ["div.jsx-661915851{position:relative;width:36px;height:36px;margin:2px 12px 0 24px;}"]
      )
    );
  }
}
Profile.propTypes = {
  baseUrl: propTypes.string.isRequired,
  user: propTypes.object.isRequired
};

const logoStyles = {
  styles: React.createElement(
    _JSXStyle,
    {
      id: "3467673193"
    },
    ["svg.jsx-3467673193{height:25px;width:27px;}", "img.jsx-3467673193{max-height:100%;min-height:auto;width:auto;}"]
  ),
  className: "jsx-3467673193"
};
const query = {
  customLogo: {
    resource: "staticContent/logo_banner"
  }
};

const pathExists = (data) => data && data.customLogo && data.customLogo.images && data.customLogo.images.png;

const LogoImage = () => {
  const { loading, error, data } = useDataQuery(query);
  if (loading) return null;
  let Logo;

  if (!error && pathExists(data)) {
    Logo = React.createElement("img", {
      alt: "Headerbar Logo",
      src: data.customLogo.images.png,
      className: logoStyles.className
    });
  } else {
    Logo = React.createElement(LogoIconWhite, {
      className: logoStyles.className
    });
  }

  return React.createElement(
    "div",
    {
      className: "jsx-3930434724"
    },
    Logo,
    logoStyles.styles,
    React.createElement(
      _JSXStyle,
      {
        id: "3930434724"
      },
      [
        "div.jsx-3930434724{padding:4px;min-width:48px;max-width:250px;height:48px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;overflow:hidden;}"
      ]
    )
  );
};

const Logo = () => {
  const { baseUrl } = useConfig();
  return React.createElement(
    "div",
    {
      "data-test": "headerbar-logo",
      className: "jsx-3962152106"
    },
    React.createElement(
      "a",
      {
        href: baseUrl,
        className: "jsx-3962152106"
      },
      React.createElement(LogoImage, null)
    ),
    React.createElement(
      _JSXStyle,
      {
        id: "3962152106"
      },
      [
        "div.jsx-3962152106{box-sizing:border-box;min-width:49px;max-height:48px;margin:0 12px 0 0;border-right:1px solid rgba(32,32,32,0.15);}",
        "a.jsx-3962152106,a.jsx-3962152106:hover,a.jsx-3962152106:focus,a.jsx-3962152106:active,a.jsx-3962152106:visited{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}"
      ]
    )
  );
};

const Title = ({ app, instance }) =>
  React.createElement(
    "div",
    {
      "data-test": "headerbar-title",
      className: "jsx-2721515324"
    },
    app ? "".concat(instance, " - ").concat(app) : "".concat(instance),
    React.createElement(
      _JSXStyle,
      {
        id: "2721515324"
      },
      [
        "div.jsx-2721515324{overflow:hidden;text-overflow:ellipsis;font-size:14px;font-weight:500;-webkit-letter-spacing:0.01em;-moz-letter-spacing:0.01em;-ms-letter-spacing:0.01em;letter-spacing:0.01em;white-space:nowrap;}"
      ]
    )
  );
Title.propTypes = {
  app: propTypes.string,
  instance: propTypes.string
};

function Email({ className }) {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "48",
      height: "48",
      viewBox: "0 0 48 48",
      className: className
    },
    React.createElement("path", {
      d:
        "M40 8H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zm0 8L24 26 8 16v-4l16 10 16-10v4z"
    }),
    React.createElement("path", {
      d: "M0 0h48v48H0z",
      fill: "none"
    })
  );
}
Email.propTypes = {
  className: propTypes.string
};

function Message({ className }) {
  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "48",
      height: "48",
      viewBox: "0 0 48 48",
      className: className
    },
    React.createElement("path", {
      d:
        "M40 4H8C5.79 4 4.02 5.79 4.02 8L4 44l8-8h28c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm-4 24H12v-4h24v4zm0-6H12v-4h24v4zm0-6H12v-4h24v4z"
    }),
    React.createElement("path", {
      d: "M0 0h48v48H0z",
      fill: "none"
    })
  );
}
Message.propTypes = {
  className: propTypes.string
};

const messageIcon = {
  styles: React.createElement(
    _JSXStyle,
    {
      id: "3410460782"
    },
    ["svg.jsx-3410460782{fill:".concat(colors.white, ";cursor:pointer;height:24px;width:24px;}")]
  ),
  className: "jsx-3410460782"
};
const interpretationIcon = {
  styles: React.createElement(
    _JSXStyle,
    {
      id: "3410460782"
    },
    ["svg.jsx-3410460782{fill:".concat(colors.white, ";cursor:pointer;height:24px;width:24px;}")]
  ),
  className: "jsx-3410460782"
};

function icon(kind) {
  if (kind === "message") {
    return React.createElement(
      Message,
      {
        className: messageIcon.className
      },
      messageIcon.styles
    );
  } else {
    return React.createElement(
      Email,
      {
        className: interpretationIcon.className
      },
      interpretationIcon.styles
    );
  }
}

const NotificationIcon = ({ count, href, kind, dataTestId }) =>
  React.createElement(
    "a",
    {
      href: href,
      "data-test": dataTestId,
      className: _JSXStyle.dynamic([["3628423681", [theme.secondary300]]]) + " " + (kind || "")
    },
    icon(kind),
    count > 0 &&
      React.createElement(
        "span",
        {
          "data-test": "".concat(dataTestId, "-count"),
          className: _JSXStyle.dynamic([["3628423681", [theme.secondary300]]])
        },
        count
      ),
    React.createElement(
      _JSXStyle,
      {
        id: "3628423681",
        dynamic: [theme.secondary300]
      },
      [
        "a.__jsx-style-dynamic-selector{position:relative;margin:8px 24px 0 0;cursor:pointer;}",
        "span.__jsx-style-dynamic-selector{z-index:1;position:absolute;top:-6px;right:-10px;width:16px;height:16px;border-radius:50%;background-color:".concat(
          theme.secondary300,
          ";color:#fff;font-size:9px;font-weight:500;line-height:16px;text-align:center;cursor:inherit;}"
        )
      ]
    )
  );
NotificationIcon.defaultProps = {
  count: 0
};
NotificationIcon.propTypes = {
  href: propTypes.string.isRequired,
  count: propTypes.number,
  dataTestId: propTypes.string,
  kind: propTypes.oneOf(["interpretation", "message"])
};

const Notifications = ({ interpretations, messages }) => {
  const { baseUrl } = useConfig();
  return React.createElement(
    "div",
    {
      "data-test": "headerbar-notifications",
      className: "jsx-1500177125"
    },
    React.createElement(NotificationIcon, {
      count: interpretations,
      href: joinPath(baseUrl, "dhis-web-interpretation"),
      kind: "message",
      dataTestId: "headerbar-interpretations"
    }),
    React.createElement(NotificationIcon, {
      message: "email",
      count: messages,
      href: joinPath(baseUrl, "dhis-web-messaging"),
      kind: "interpretation",
      dataTestId: "headerbar-messages"
    }),
    React.createElement(
      _JSXStyle,
      {
        id: "1500177125"
      },
      [
        "div.jsx-1500177125{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}"
      ]
    )
  );
};
Notifications.propTypes = {
  interpretations: propTypes.number,
  messages: propTypes.number
};

var Settings$1 = "الإعدادات";
var Account$1 = "الحساب";
var Help$1 = "مساعدة";
var Logout = "تسجيل الخروج";
var arTranslations = {
  "Search apps": "البحث في التطبيقات",
  "Edit profile": "تعديل ملف التعريف",
  Settings: Settings$1,
  Account: Account$1,
  Help: Help$1,
  "About DHIS2": "عن DHIS2",
  Logout: Logout,
  "Something went wrong with loading the children.": "حدث خطأ أثناء تحميل الأبناء"
};

var Settings$2 = "ريكخستن";
var Account$2 = "";
var Help$2 = "هاوكاري";
var Logout$1 = "";
var ckbTranslations = {
  "Search apps": "",
  "Edit profile": "",
  Settings: Settings$2,
  Account: Account$2,
  Help: Help$2,
  "About DHIS2": "",
  Logout: Logout$1,
  "Something went wrong with loading the children.": ""
};

var Settings$3 = "Settings";
var Account$3 = "Account";
var Help$3 = "Help";
var Logout$2 = "";
var daTranslations = {
  "Search apps": "Search apps",
  "Edit profile": "",
  Settings: Settings$3,
  Account: Account$3,
  Help: Help$3,
  "About DHIS2": "",
  Logout: Logout$2,
  "Something went wrong with loading the children.": ""
};

var Settings$4 = "";
var Account$4 = "";
var Help$4 = "";
var Logout$3 = "";
var enTranslations = {
  "Search apps": "",
  "Edit profile": "",
  Settings: Settings$4,
  Account: Account$4,
  Help: Help$4,
  "About DHIS2": "",
  Logout: Logout$3,
  "Could not load children": ""
};

var Settings$5 = "Configuraciones";
var Account$5 = "Cuenta";
var Help$5 = "Ayuda";
var Logout$4 = "Cerrar sesión";
var esTranslations = {
  "Search apps": "Buscar aplicaciones",
  "Edit profile": "Editar perfil",
  Settings: Settings$5,
  Account: Account$5,
  Help: Help$5,
  "About DHIS2": "Acerca de DHIS2",
  Logout: Logout$4,
  "Something went wrong with loading the children.": ""
};

var Settings$6 = "Réglages";
var Account$6 = "Compte";
var Help$6 = "Aide";
var Logout$5 = "Déconnexion";
var frTranslations = {
  "Search apps": "Chercher applications",
  "Edit profile": "Modifier le profil",
  Settings: Settings$6,
  Account: Account$6,
  Help: Help$6,
  "About DHIS2": "A propos de DHIS2",
  Logout: Logout$5,
  "Something went wrong with loading the children.": ""
};

var Settings$7 = "Setting";
var Account$7 = "Akun";
var Help$7 = "Bantuan";
var Logout$6 = "";
var idTranslations = {
  "Search apps": "Cari app",
  "Edit profile": "Edit profil",
  Settings: Settings$7,
  Account: Account$7,
  Help: Help$7,
  "About DHIS2": "",
  Logout: Logout$6,
  "Something went wrong with loading the children.": ""
};

var Settings$8 = "ការ​កំណត់";
var Account$8 = "គណនី";
var Help$8 = "ជំនួយ​";
var Logout$7 = "";
var kmTranslations = {
  "Search apps": "",
  "Edit profile": "កែសម្រួល​​ជីវប្រវត្តិ",
  Settings: Settings$8,
  Account: Account$8,
  Help: Help$8,
  "About DHIS2": "",
  Logout: Logout$7,
  "Something went wrong with loading the children.": ""
};

var Settings$9 = "ຕັ້ງຄ່າ";
var Account$9 = "ບັນຊີ";
var Help$9 = "ຊ່ວຍ";
var Logout$8 = "";
var loTranslations = {
  "Search apps": "ຄົ້ນຫາແອັບ",
  "Edit profile": "ແກ້ໄຂຂໍ້ມູນ",
  Settings: Settings$9,
  Account: Account$9,
  Help: Help$9,
  "About DHIS2": "",
  Logout: Logout$8,
  "Something went wrong with loading the children.": ""
};

var Settings$a = "သတ်မှတ်ချက်များ";
var Account$a = "စာရင်း";
var Help$a = "အကူအညီတောင်းခံရန်";
var Logout$9 = "";
var myTranslations = {
  "Search apps": "Search apps",
  "Edit profile": "အတ္ထုပ္ပတ္တိအကျဉ်းကိုပြင်ဆင်ခြင်း",
  Settings: Settings$a,
  Account: Account$a,
  Help: Help$a,
  "About DHIS2": "",
  Logout: Logout$9,
  "Something went wrong with loading the children.": ""
};

var Settings$b = "Innstillinger";
var Account$b = "Brukerkonto";
var Help$b = "Hjelp";
var Logout$a = "Logg ut";
var nbTranslations = {
  "Search apps": "Søk etter apper",
  "Edit profile": "Rediger profil",
  Settings: Settings$b,
  Account: Account$b,
  Help: Help$b,
  "About DHIS2": "Om DHIS2",
  Logout: Logout$a,
  "Something went wrong with loading the children.": "Noe gikk galt med å laste underordnede enheter."
};

var Settings$c = "تنظیمات";
var Account$c = "حساب";
var Help$c = "کمک";
var Logout$b = "";
var prsTranslations = {
  "Search apps": "جستجوی برنامه ها",
  "Edit profile": "ویرایش پروفایل",
  Settings: Settings$c,
  Account: Account$c,
  Help: Help$c,
  "About DHIS2": "",
  Logout: Logout$b,
  "Something went wrong with loading the children.": ""
};

var Settings$d = "ترتیبات [ ترتیبات ]";
var Account$d = "حساب";
var Help$d = "مرسته";
var Logout$c = "";
var psTranslations = {
  "Search apps": "د پلټنې اپلیکېشنونه",
  "Edit profile": "د مالوماتو یا ځانګړتیاوو تصحیح",
  Settings: Settings$d,
  Account: Account$d,
  Help: Help$d,
  "About DHIS2": "",
  Logout: Logout$c,
  "Something went wrong with loading the children.": ""
};

var Settings$e = "Configurações";
var Account$e = "Conta";
var Help$e = "Ajuda";
var Logout$d = "";
var ptTranslations = {
  "Search apps": "Pesquisar aplicações",
  "Edit profile": "Editar o perfil",
  Settings: Settings$e,
  Account: Account$e,
  Help: Help$e,
  "About DHIS2": "",
  Logout: Logout$d,
  "Something went wrong with loading the children.": ""
};

var Settings$f = "Configurações";
var Account$f = "Conta";
var Help$f = "Ajuda";
var Logout$e = "";
var pt_BRTranslations = {
  "Search apps": "",
  "Edit profile": "Editar Perfil",
  Settings: Settings$f,
  Account: Account$f,
  Help: Help$f,
  "About DHIS2": "",
  Logout: Logout$e,
  "Something went wrong with loading the children.": ""
};

var Settings$g = "Настройки";
var Account$g = "Учетная запись";
var Help$g = "Помощь";
var Logout$f = "";
var ruTranslations = {
  "Search apps": "Поиск приложений",
  "Edit profile": "Редактировать профиль",
  Settings: Settings$g,
  Account: Account$g,
  Help: Help$g,
  "About DHIS2": "",
  Logout: Logout$f,
  "Something went wrong with loading the children.": ""
};

var Settings$h = "inställningar";
var Account$h = "Konto";
var Help$h = "Hjälp";
var Logout$g = "";
var svTranslations = {
  "Search apps": "Sök program",
  "Edit profile": "Redigera profil",
  Settings: Settings$h,
  Account: Account$h,
  Help: Help$h,
  "About DHIS2": "",
  Logout: Logout$g,
  "Something went wrong with loading the children.": ""
};

var Settings$i = "Konfigurasaun";
var Account$i = "Konta";
var Help$i = "Ajuda";
var Logout$h = "";
var tetTranslations = {
  "Search apps": "Buka aplikasoens",
  "Edit profile": "Edita perfil",
  Settings: Settings$i,
  Account: Account$i,
  Help: Help$i,
  "About DHIS2": "",
  Logout: Logout$h,
  "Something went wrong with loading the children.": ""
};

var Settings$j = "Танзимот";
var Account$j = "Ҳисоб";
var Help$j = "Кӯмак";
var Logout$i = "";
var tgTranslations = {
  "Search apps": "",
  "Edit profile": "Таҳрири профил",
  Settings: Settings$j,
  Account: Account$j,
  Help: Help$j,
  "About DHIS2": "",
  Logout: Logout$i,
  "Something went wrong with loading the children.": ""
};

var Settings$k = "Налаштування";
var Account$k = "Обліковий запис";
var Help$k = "Допомога";
var Logout$j = "";
var ukTranslations = {
  "Search apps": "Пошук додатків",
  "Edit profile": "Редагувати профіль",
  Settings: Settings$k,
  Account: Account$k,
  Help: Help$k,
  "About DHIS2": "Про DHIS2",
  Logout: Logout$j,
  "Something went wrong with loading the children.": ""
};

var Settings$l = "ترتیبات";
var Account$l = "اکاؤنٹ";
var Help$l = "مدد";
var Logout$k = "";
var urTranslations = {
  "Search apps": "ایپس تلاش کریں",
  "Edit profile": "پروفائل میں ترمیم کریں",
  Settings: Settings$l,
  Account: Account$l,
  Help: Help$l,
  "About DHIS2": "",
  Logout: Logout$k,
  "Something went wrong with loading the children.": ""
};

var Settings$m = "Các thiết lập";
var Account$m = "Tài khoản";
var Help$m = "Giúp đỡ";
var Logout$l = "Đăng xuất";
var viTranslations = {
  "Search apps": "Tìm kiếm ứng dụng",
  "Edit profile": "Chỉnh sửa hồ sơ",
  Settings: Settings$m,
  Account: Account$m,
  Help: Help$m,
  "About DHIS2": "Giới thiệu DHIS2",
  Logout: Logout$l,
  "Something went wrong with loading the children.": ""
};

var Settings$n = "设置";
var Account$n = "账号";
var Help$n = "帮助";
var Logout$m = "退出";
var zhTranslations = {
  "Search apps": "搜索 apps",
  "Edit profile": "编辑个人基本信息",
  Settings: Settings$n,
  Account: Account$n,
  Help: Help$n,
  "About DHIS2": "关于DHIS2",
  Logout: Logout$m,
  "Something went wrong with loading the children.": "载入下属发生错误"
};

var Settings$o = "设置";
var Account$o = "账号";
var Help$o = "帮助";
var Logout$n = "退出";
var zh_CNTranslations = {
  "Search apps": "搜索APP",
  "Edit profile": "编辑基本信息",
  Settings: Settings$o,
  Account: Account$o,
  Help: Help$o,
  "About DHIS2": "关于DHIS2",
  Logout: Logout$n,
  "Something went wrong with loading the children.": "载入下属资源出错"
};

//------------------------------------------------------------------------------
const namespace = "default";
i18n.addResources("ar", namespace, arTranslations);
i18n.addResources("ckb", namespace, ckbTranslations);
i18n.addResources("da", namespace, daTranslations);
i18n.addResources("en", namespace, enTranslations);
i18n.addResources("es", namespace, esTranslations);
i18n.addResources("fr", namespace, frTranslations);
i18n.addResources("id", namespace, idTranslations);
i18n.addResources("km", namespace, kmTranslations);
i18n.addResources("lo", namespace, loTranslations);
i18n.addResources("my", namespace, myTranslations);
i18n.addResources("nb", namespace, nbTranslations);
i18n.addResources("prs", namespace, prsTranslations);
i18n.addResources("ps", namespace, psTranslations);
i18n.addResources("pt", namespace, ptTranslations);
i18n.addResources("pt_BR", namespace, pt_BRTranslations);
i18n.addResources("ru", namespace, ruTranslations);
i18n.addResources("sv", namespace, svTranslations);
i18n.addResources("tet", namespace, tetTranslations);
i18n.addResources("tg", namespace, tgTranslations);
i18n.addResources("uk", namespace, ukTranslations);
i18n.addResources("ur", namespace, urTranslations);
i18n.addResources("vi", namespace, viTranslations);
i18n.addResources("zh", namespace, zhTranslations);
i18n.addResources("zh_CN", namespace, zh_CNTranslations);

const query$1 = {
  title: {
    resource: "systemSettings/applicationTitle"
  },
  user: {
    resource: "me"
  },
  apps: {
    resource: "action::menu/getModules"
  },
  notifications: {
    resource: "me/dashboard"
  }
};
const HeaderBar = ({ appName, className }) => {
  const { baseUrl } = useConfig();
  const { loading, error, data } = useDataQuery(query$1);
  const apps = useMemo(() => {
    const getPath = (path) =>
      path.startsWith("http:") || path.startsWith("https:") ? path : joinPath(baseUrl, "api", path);

    return data === null || data === void 0
      ? void 0
      : data.apps.modules.map((app) =>
          _objectSpread2({}, app, {
            icon: getPath(app.icon),
            defaultAction: getPath(app.defaultAction)
          })
        );
  }, [data]);

  if (!loading && !error) {
    // TODO: This will run every render which is probably wrong!  Also, setting the global locale shouldn't be done in the headerbar
    const locale = data.user.settings.keyUiLocale || "en";
    i18n.setDefaultNamespace("default");
    i18n.changeLanguage(locale);
  }

  return React.createElement(
    "header",
    {
      className: _JSXStyle.dynamic([["1251183236", [colors.white]]]) + " " + (className || "")
    },
    !loading &&
      !error &&
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Logo, null),
        React.createElement(Title, {
          app: appName,
          instance: data.title.applicationTitle
        }),
        React.createElement("div", {
          className: _JSXStyle.dynamic([["1251183236", [colors.white]]]) + " " + "right-control-spacer"
        }),
        React.createElement(Notifications, {
          interpretations: data.notifications.unreadInterpretations,
          messages: data.notifications.unreadMessageConversations
        }),
        React.createElement(Apps$1, {
          apps: apps
        }),
        React.createElement(Profile, {
          user: data.user,
          baseUrl: baseUrl
        })
      ),
    React.createElement(
      _JSXStyle,
      {
        id: "1251183236",
        dynamic: [colors.white]
      },
      [
        "header.__jsx-style-dynamic-selector{background-color:#2c6693;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;height:48px;border-bottom:1px solid rgba(32,32,32,0.15);color:".concat(
          colors.white,
          ";}"
        ),
        ".right-control-spacer.__jsx-style-dynamic-selector{margin-left:auto;}"
      ]
    )
  );
};
HeaderBar.propTypes = {
  appName: propTypes.string,
  className: propTypes.string
};

const ErrorMessage = ({ children, dataTest }) =>
  React.createElement(
    "span",
    {
      "data-test": "".concat(dataTest, "-error"),
      className: _JSXStyle.dynamic([["618092015", [colors.grey800, spacers.dp4, theme.error]]])
    },
    children,
    React.createElement(
      _JSXStyle,
      {
        id: "618092015",
        dynamic: [colors.grey800, spacers.dp4, theme.error]
      },
      [
        "span.__jsx-style-dynamic-selector{font-size:14px;color:"
          .concat(colors.grey800, ";margin:")
          .concat(spacers.dp4, ";color:")
          .concat(theme.error, ";}")
      ]
    )
  );
ErrorMessage.propTypes = {
  children: propTypes$1.any.isRequired,
  dataTest: propTypes$1.string.isRequired
};

/**
 * @module
 * @returns {React.Component}
 */

const FolderOpen = ({ dataTest }) =>
  React.createElement(
    "svg",
    {
      width: "18px",
      height: "18px",
      viewBox: "0 0 18 18",
      version: "1.1",
      "data-test": "".concat(dataTest, "-iconfolderopen"),
      className: "jsx-2091325045"
    },
    React.createElement(
      "g",
      {
        id: "icon/folder/open",
        stroke: "none",
        strokeWidth: "1",
        fill: "none",
        fillRule: "evenodd",
        className: "jsx-2091325045"
      },
      React.createElement(
        "g",
        {
          id: "Group",
          transform: "translate(0.000000, 3.000000)",
          stroke: "#6E7A8A",
          className: "jsx-2091325045"
        },
        React.createElement("path", {
          d:
            "M2,0.5 C1.17157288,0.5 0.5,1.17157288 0.5,2 L0.5,10 C0.5,10.8284271 1.17157288,11.5 2,11.5 L12,11.5 C12.8284271,11.5 13.5,10.8284271 13.5,10 L13.5,4 C13.5,3.17157288 12.8284271,2.5 12,2.5 L6.69098301,2.5 L5.82917961,0.776393202 C5.7444836,0.607001188 5.57135204,0.5 5.38196601,0.5 L2,0.5 Z",
          id: "Path-2",
          fill: "#A0ADBA",
          className: "jsx-2091325045"
        }),
        React.createElement("path", {
          d:
            "M1.53632259,10.7093809 C1.47575089,10.7941813 1.44318932,10.8957885 1.44318932,11 C1.44318932,11.2761424 1.66704695,11.5 1.94318932,11.5 L12.4853821,11.5 C12.6468577,11.5 12.7983931,11.4220172 12.8922488,11.2906191 L16.4636774,6.2906191 C16.5242491,6.20581872 16.5568107,6.10421149 16.5568107,6 C16.5568107,5.72385763 16.3329531,5.5 16.0568107,5.5 L5.5146179,5.5 C5.35314234,5.5 5.20160692,5.57798284 5.10775116,5.7093809 L1.53632259,10.7093809 Z",
          id: "Path-3",
          fill: "#FBFCFD",
          className: "jsx-2091325045"
        })
      )
    ),
    React.createElement(
      _JSXStyle,
      {
        id: "2091325045"
      },
      ["svg.jsx-2091325045{margin:3px 0;display:block;}"]
    )
  );
FolderOpen.propTypes = {
  dataTest: propTypes.string.isRequired
};

/**
 * @module
 * @returns {React.Component}
 */

const FolderClosed = ({ dataTest }) =>
  React.createElement(
    "svg",
    {
      width: "18px",
      height: "18px",
      viewBox: "0 0 18 18",
      version: "1.1",
      "data-test": "".concat(dataTest, "-iconfolderclosed"),
      className: "jsx-3201893673"
    },
    React.createElement(
      "g",
      {
        id: "icon/folder/closed",
        stroke: "none",
        strokeWidth: "1",
        fill: "none",
        fillRule: "evenodd",
        className: "jsx-3201893673"
      },
      React.createElement("path", {
        d:
          "M2,3.5 C1.17157288,3.5 0.5,4.17157288 0.5,5 L0.5,13 C0.5,13.8284271 1.17157288,14.5 2,14.5 L12,14.5 C12.8284271,14.5 13.5,13.8284271 13.5,13 L13.5,7 C13.5,6.17157288 12.8284271,5.5 12,5.5 L6.69098301,5.5 L5.82917961,3.7763932 C5.7444836,3.60700119 5.57135204,3.5 5.38196601,3.5 L2,3.5 Z",
        id: "Path-2",
        stroke: "#6E7A8A",
        fill: "#D5DDE5",
        className: "jsx-3201893673"
      })
    ),
    React.createElement(
      _JSXStyle,
      {
        id: "3201893673"
      },
      ["svg.jsx-3201893673{display:block;margin:3px 0;}"]
    )
  );
FolderClosed.propTypes = {
  dataTest: propTypes.string.isRequired
};

/**
 * @module
 * @returns {React.Component}
 */

const Single = ({ dataTest }) =>
  React.createElement(
    "svg",
    {
      height: "18px",
      version: "1.1",
      viewBox: "0 0 18 18",
      width: "18px",
      "data-test": "".concat(dataTest, "-iconsingle"),
      className: "jsx-3201893673"
    },
    React.createElement(
      "g",
      {
        fill: "none",
        fillRule: "evenodd",
        id: "icon/single",
        stroke: "none",
        strokeWidth: "1",
        className: "jsx-3201893673"
      },
      React.createElement("rect", {
        fill: "#A0ADBA",
        height: "4",
        id: "Rectangle",
        rx: "1",
        width: "4",
        x: "7",
        y: "7",
        className: "jsx-3201893673"
      })
    ),
    React.createElement(
      _JSXStyle,
      {
        id: "3201893673"
      },
      ["svg.jsx-3201893673{display:block;margin:3px 0;}"]
    )
  );
Single.propTypes = {
  dataTest: propTypes.string.isRequired
};

/**
 * @module
 * @returns {React.Component}
 */

const Empty = ({ dataTest }) =>
  React.createElement(
    "svg",
    {
      height: "18px",
      version: "1.1",
      viewBox: "0 0 18 18",
      width: "18px",
      "data-test": "".concat(dataTest, "-iconempty"),
      className: "jsx-3201893673"
    },
    React.createElement("g", {
      fill: "none",
      fillRule: "evenodd",
      id: "icon/empty",
      stroke: "none",
      strokeWidth: "1",
      className: "jsx-3201893673"
    }),
    React.createElement(
      _JSXStyle,
      {
        id: "3201893673"
      },
      ["svg.jsx-3201893673{display:block;margin:3px 0;}"]
    )
  );
Empty.propTypes = {
  dataTest: propTypes.string.isRequired
};

const UNIT_ID_PATTERN = "[a-zA-Z][a-zA-Z0-9]{10}";
/* eslint-disable */

const orgUnitPathPropType = (propValue, key, compName, location, propFullName) => {
  if (!new RegExp("(/".concat(UNIT_ID_PATTERN, ")+")).test(propValue[key])) {
    return new Error(
      "Invalid org unit path `"
        .concat(propValue[key], "` supplied to `")
        .concat(compName, ".")
        .concat(propFullName, "`")
    );
  }
};
/* eslint-enable */

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {Function} props.onToggleOpen
 * @param {bool} [props.loading]
 * @returns {React.Component}
 */

const DisabledSelectionLabel = ({ label, loading, onToggleOpen }) =>
  React.createElement(SingleSelectionLabel, {
    checked: false,
    loading: loading,
    label: label,
    onChange: onToggleOpen
  });

DisabledSelectionLabel.propTypes = {
  label: propTypes$1.string.isRequired,
  onToggleOpen: propTypes$1.func.isRequired,
  loading: propTypes$1.bool
};
/**
 * @param {Object} props
 * @param {string} props.label
 * @param {bool} [props.checked]
 * @param {bool} [props.loading]
 * @param {Function} [props.onChange]
 * @returns {React.Component}
 */

const SingleSelectionLabel = ({ checked, label, onChange, loading }) =>
  React.createElement(
    "span",
    {
      onClick: (event) => {
        const payload = {
          checked: !checked
        };
        onChange(payload, event);
      },
      className:
        _JSXStyle.dynamic([["978088480", [colors.grey900, colors.teal700]]]) +
        " " +
        (cx({
          checked,
          loading
        }) || "")
    },
    label,
    React.createElement(
      _JSXStyle,
      {
        id: "978088480",
        dynamic: [colors.grey900, colors.teal700]
      },
      [
        "span.__jsx-style-dynamic-selector{background:transparent;border-radius:3px;color:".concat(
          colors.grey900,
          ";cursor:pointer;display:inline-block;font-size:14px;line-height:24px;padding:0 5px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap;}"
        ),
        ".checked.__jsx-style-dynamic-selector{background:".concat(colors.teal700, ";color:white;}"),
        ".loading.__jsx-style-dynamic-selector{cursor:auto;}"
      ]
    )
  );

SingleSelectionLabel.propTypes = {
  label: propTypes$1.string.isRequired,
  checked: propTypes$1.bool,
  loading: propTypes$1.bool,
  onChange: propTypes$1.func
};
/**
 * @param {Object} props
 * @param {bool} props.highlighted
 * @param {React.Component|React.Component[]} props.children
 * @returns {React.Component}
 */

const LabelContainer = ({ highlighted, children }) =>
  React.createElement(
    "div",
    {
      className:
        _JSXStyle.dynamic([["1931208556", [colors.teal200]]]) +
        " " +
        (cx({
          highlighted
        }) || "")
    },
    React.createElement(
      "span",
      {
        className: _JSXStyle.dynamic([["1931208556", [colors.teal200]]])
      },
      children
    ),
    React.createElement(
      _JSXStyle,
      {
        id: "1931208556",
        dynamic: [colors.teal200]
      },
      [
        "div.__jsx-style-dynamic-selector{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}",
        "span.__jsx-style-dynamic-selector{display:block;}",
        ".highlighted.__jsx-style-dynamic-selector{background:".concat(colors.teal200, ";padding-right:4px;}")
      ]
    )
  );

LabelContainer.propTypes = {
  children: propTypes$1.node,
  highlighted: propTypes$1.bool
};
/**
 * @param {Object} props
 * @param {bool} props.hasChildren
 * @param {bool} props.open
 * @returns {React.Component}
 */

const Icon = ({ loading, hasChildren, open, dataTest }) => {
  if (loading) {
    return React.createElement(Empty, {
      dataTest: dataTest
    });
  }

  if (!hasChildren) {
    return React.createElement(Single, {
      dataTest: dataTest
    });
  }

  if (open) {
    return React.createElement(FolderOpen, {
      dataTest: dataTest
    });
  }

  return React.createElement(FolderClosed, {
    dataTest: dataTest
  });
};

Icon.propTypes = {
  dataTest: propTypes$1.string.isRequired,
  hasChildren: propTypes$1.bool,
  loading: propTypes$1.bool,
  open: propTypes$1.bool
};

const IconizedCheckbox = ({
  checked,
  dataTest,
  hasChildren,
  indeterminate,
  label,
  loading,
  name,
  open,
  value,
  onChange
}) => {
  const icon = React.createElement(Icon, {
    loading: loading,
    open: open,
    hasChildren: hasChildren,
    dataTest: dataTest
  });
  const checkboxLabel = React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "span",
      {
        className: "jsx-3097236308"
      },
      icon
    ),
    label,
    React.createElement(
      _JSXStyle,
      {
        id: "3097236308"
      },
      ["span.jsx-3097236308{display:inline-block;margin-right:4px;}"]
    )
  );
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Checkbox, {
      dense: true,
      checked: checked,
      name: name,
      value: value,
      label: checkboxLabel,
      indeterminate: indeterminate,
      onChange: onChange
    })
  );
};

IconizedCheckbox.propTypes = {
  checked: propTypes$1.bool.isRequired,
  dataTest: propTypes$1.string.isRequired,
  hasChildren: propTypes$1.bool.isRequired,
  indeterminate: propTypes$1.bool.isRequired,
  label: propTypes$1.string.isRequired,
  loading: propTypes$1.bool.isRequired,
  name: propTypes$1.string.isRequired,
  open: propTypes$1.bool.isRequired,
  value: propTypes$1.string.isRequired,
  onChange: propTypes$1.func.isRequired
};

const createNewSelected = ({ selected, path, checked, singleSelection }) => {
  const pathIndex = selected.indexOf(path);
  if (checked && pathIndex !== -1) return selected;
  if (singleSelection && checked) return [path];
  if (checked) return [...selected, path];
  if (pathIndex === -1) return selected;
  if (singleSelection) return [];
  if (selected.indexOf(path) === 0) return selected.slice(1);
  const prevSlice = selected.slice(0, pathIndex);
  const nextSlice = selected.slice(pathIndex + 1);
  return [...prevSlice, ...nextSlice];
};
/**
 * @module
 * @param {Label.PropTypes} props
 * @returns {React.Component}
 */

const Label = ({
  id,
  path,
  open,
  loading,
  checked,
  onChange,
  dataTest,
  selected,
  hasChildren,
  highlighted,
  displayName,
  onToggleOpen,
  disableSelection,
  singleSelection,
  hasSelectedDescendants
}) => {
  const onClick = ({ checked }, event) => {
    const newSelected = createNewSelected({
      selected,
      path,
      checked,
      singleSelection
    });
    onChange(
      {
        id,
        path,
        checked,
        selected: newSelected
      },
      event
    );
  };

  if (disableSelection) {
    return React.createElement(
      LabelContainer,
      {
        highlighted: highlighted
      },
      React.createElement(DisabledSelectionLabel, {
        label: displayName,
        loading: loading,
        onToggleOpen: onToggleOpen
      })
    );
  }

  if (singleSelection) {
    return React.createElement(
      LabelContainer,
      {
        highlighted: highlighted
      },
      React.createElement(
        SingleSelectionLabel,
        {
          checked: checked,
          label: displayName,
          onChange: onClick,
          loading: loading
        },
        displayName
      )
    );
  }

  return React.createElement(
    LabelContainer,
    {
      highlighted: highlighted
    },
    React.createElement(IconizedCheckbox, {
      dataTest: dataTest,
      checked: checked,
      name: "org-unit",
      value: id,
      label: displayName,
      loading: loading,
      indeterminate: !checked && hasSelectedDescendants,
      onChange: onClick,
      open: open,
      hasChildren: hasChildren
    })
  );
};
/**
 * @typedef {Object} PropTypes
 * @static
 *
 * @prop {string} id
 * @prop {string} path
 * @prop {string} displayName
 * @prop {bool} open
 * @prop {bool} loading
 * @prop {bool} hasChildren
 * @prop {Function} [onChange]
 * @prop {Function} [onToggleOpen]
 * @prop {bool} [checked]
 * @prop {bool} [highlighted]
 * @prop {bool} [disableSelection]
 * @prop {bool} [singleSelection]
 * @prop {bool} [hasSelectedDescendants]
 */

Label.propTypes = {
  dataTest: propTypes$1.string.isRequired,
  displayName: propTypes$1.string.isRequired,
  hasChildren: propTypes$1.bool.isRequired,
  id: propTypes$1.string.isRequired,
  loading: propTypes$1.bool.isRequired,
  open: propTypes$1.bool.isRequired,
  path: propTypes$1.string.isRequired,
  onChange: propTypes$1.func.isRequired,
  onToggleOpen: propTypes$1.func.isRequired,
  checked: propTypes$1.bool,
  disableSelection: propTypes$1.bool,
  hasSelectedDescendants: propTypes$1.bool,
  highlighted: propTypes$1.bool,
  selected: propTypes$1.arrayOf(orgUnitPathPropType),
  singleSelection: propTypes$1.bool
};

/**
 * @param {string[]} includedPaths
 * @param {string} path
 * @returns {bool}
 */
const isPathIncluded = (includedPaths, path) => {
  const isIncluded = includedPaths.some((includedPath) => {
    if (path === includedPath) return true;
    return includedPath.indexOf("".concat(path, "/")) === 0;
  });
  return isIncluded;
};
/**
 * Returns all the childrenIds that should be rendered.
 * An id will be included if it's parent's path + the id is inside
 * the "filter" or the parent's path + id is a substring
 * of the paths in "filter" (then it's a parent path of
 * the units that should be included itself)
 *
 * @param {Object} node
 * @param {{ id: String }[]} node.children
 * @param {string[]} includedPaths
 * @returns {string[]}
 */

const computeChildNodes = (node, filter) => {
  if (!filter.length) {
    return node.children;
  }

  return node.children.filter((child) => {
    return isPathIncluded(filter, "".concat(node.path, "/").concat(child.id));
  });
};

/**
 * Checks wether there are descendants of a path in the
 * array of selected paths
 *
 * @param {string} path
 * @param {string[]} selected
 * @returns {bool}
 */
const hasDescendantSelectedPaths = (path, selected) =>
  selected.some((selectedPath) => selectedPath !== path && selectedPath.indexOf(path) === 0);

/**
 * @param {Object} args
 * @param {string} args.path
 * @param {string} [args.errorMessage]
 * @param {string} [args.autoExpandLoadingError]
 * @param {string[]} args.expanded
 * @param {Function} [args.onExpand]
 * @param {Function} [args.onCollapse]
 * @returns {Object}
 */

const useOpenState = ({ path, expanded, onExpand, onCollapse, errorMessage, autoExpandLoadingError }) => {
  const autoExpand = autoExpandLoadingError && !!errorMessage;
  const [openedOnceDueToError, setOpenedOnce] = useState(!!errorMessage);
  const [open, setOpen] = useState(autoExpand || expanded.includes(path));
  useEffect(() => {
    if (autoExpand && !openedOnceDueToError) {
      setOpen(true);
      setOpenedOnce(true);
    }
  }, [autoExpand, openedOnceDueToError]);

  const onToggleOpen = () => {
    const newOpen = !open;
    const payload = {
      path
    };
    setOpen(newOpen);

    if (onExpand && newOpen) {
      onExpand(payload);
    } else if (onCollapse && !newOpen) {
      onCollapse(payload);
    }
  };

  return {
    open,
    onToggleOpen
  };
};

const fromEntries = (entries) =>
  entries.reduce(
    (collection, [key, name]) =>
      _objectSpread2({}, collection, {
        [key]: name
      }),
    {}
  );

const withChildrenFields = "children[path,displayName,id],displayName,path,id";
const withoutChildrenFields = "displayName,path,id";
const createOrgUnitQuery = (id) => ({
  resource: "organisationUnits/".concat(id),
  params: ({ withChildren, isUserDataViewFallback }) => ({
    isUserDataViewFallback,
    fields: withChildren ? withChildrenFields : withoutChildrenFields,
    paging: false
  })
});
const createQuery = (ids) =>
  ids.reduce(
    (query, id) =>
      _objectSpread2({}, query, {
        [id]: createOrgUnitQuery(id)
      }),
    {}
  );
/**
 * @param {Object.<string, Object>[]} nodes
 * @returns {}
 */

const addMissingDisplayNameProps = (nodes) => {
  const nodeEntries = Object.entries(nodes);
  const nodesWithDisplayName = nodeEntries.map(([id, node]) => {
    const displayName = node.displayName || "";
    return [
      id,
      _objectSpread2({}, node, {
        displayName
      })
    ];
  });
  return fromEntries(nodesWithDisplayName);
};

/**
 * @param {string[]} ids
 * @param {Object} [options]
 * @param {boolean} [options.withChildren]
 * @param {boolean} [options.isUserDataViewFallback]
 * @returns {Object}
 */

const useOrgData = (ids, { withChildren = true, isUserDataViewFallback } = {}) => {
  const query = createQuery(ids);
  const variables = {
    withChildren,
    isUserDataViewFallback
  };
  const { loading, error, data, refetch } = useDataQuery(query, {
    variables
  });
  const nodes = data ? addMissingDisplayNameProps(data) : {};
  return {
    loading,
    error,
    data: nodes,
    refetch
  };
};

const loadingSpinnerStyles = {
  styles: React.createElement(
    _JSXStyle,
    {
      id: "1427691812"
    },
    [".small.jsx-1427691812{display:block;margin:3px 0;width:18px;height:18px;}"]
  ),
  className: "jsx-1427691812"
};

const LoadingSpinner = () =>
  React.createElement(
    "div",
    {
      className: "jsx-2503342345"
    },
    React.createElement(CircularLoader, {
      small: true,
      className: loadingSpinnerStyles.className
    }),
    React.createElement("style", null, loadingSpinnerStyles.styles),
    React.createElement(
      _JSXStyle,
      {
        id: "2503342345"
      },
      ["div.jsx-2503342345{width:24px;}"]
    )
  );

const OrganisationUnitNode = ({
  autoExpandLoadingError,
  dataTest,
  disableSelection,
  displayName,
  expanded,
  highlighted,
  id,
  isUserDataViewFallback,
  path,
  selected,
  singleSelection,
  filter,
  onChange,
  onChildrenLoaded,
  onCollapse,
  onExpand
}) => {
  const { loading, error, data } = useOrgData([id], {
    isUserDataViewFallback
  });
  const childNodes = !loading && !error ? computeChildNodes(data[id], filter) : [];
  const hasChildren = !!childNodes.length;
  const hasSelectedDescendants = hasDescendantSelectedPaths(path, selected);
  const isHighlighted = highlighted.includes(path);
  const { open, onToggleOpen } = useOpenState({
    autoExpandLoadingError,
    errorMessage: error && error.toString(),
    path,
    expanded,
    onExpand,
    onCollapse
  });
  const isSelected = selected.includes(path);
  useEffect(() => {
    if (!loading && !error && onChildrenLoaded) {
      onChildrenLoaded(data);
    }
  }, [loading, error, onChildrenLoaded]);
  const label = React.createElement(Label, {
    checked: isSelected,
    dataTest: "".concat(dataTest, "-label"),
    disableSelection: disableSelection,
    displayName: displayName,
    hasChildren: hasChildren,
    hasSelectedDescendants: hasSelectedDescendants,
    highlighted: isHighlighted,
    id: id,
    loading: loading,
    onChange: onChange,
    selected: selected,
    onToggleOpen: onToggleOpen,
    open: open,
    path: path,
    singleSelection: singleSelection
  });
  /**
   * No children means no arrow, therefore we have to provide something.
   * While "loading" is true, "hasChildren" is false
   * There are some possible children variants as content of this node:
   *
   * 1. Nothing; There are no children
   * 2. Placeholder: There are children, but the Node is closed (show arrow)
   * 3. Error: There are children and loading information somehow failed
   * 4. Child nodes: There are children and the node is open
   */

  const showPlaceholder = hasChildren && !open && !error;
  const showChildNodes = hasChildren && open && !error;
  return React.createElement(
    Node,
    {
      dataTest: "".concat(dataTest, "-node"),
      open: open,
      onOpen: onToggleOpen,
      onClose: onToggleOpen,
      component: label,
      icon: loading && React.createElement(LoadingSpinner, null)
    },
    error &&
      React.createElement(
        ErrorMessage,
        {
          dataTest: dataTest
        },
        i18n.t("Could not load children")
      ),
    showPlaceholder &&
      React.createElement("span", {
        "data-test": "".concat(dataTest, "-placeholder")
      }),
    showChildNodes &&
      childNodes.map((child) => {
        const childPath = "".concat(path, "/").concat(child.id);
        const grandChildNodes = computeChildNodes(child, filter);
        return React.createElement(OrganisationUnitNode, {
          key: childPath,
          autoExpandLoadingError: autoExpandLoadingError,
          childNodes: grandChildNodes,
          dataTest: dataTest,
          disableSelection: disableSelection,
          displayName: child.displayName,
          expanded: expanded,
          filter: filter,
          highlighted: highlighted,
          id: child.id,
          isUserDataViewFallback: isUserDataViewFallback,
          path: childPath,
          selected: selected,
          singleSelection: singleSelection,
          onChange: onChange,
          onChildrenLoaded: onChildrenLoaded,
          onCollapse: onCollapse,
          onExpand: onExpand
        });
      })
  );
};
OrganisationUnitNode.propTypes = {
  dataTest: propTypes.string.isRequired,
  id: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  autoExpandLoadingError: propTypes.bool,
  disableSelection: propTypes.bool,
  displayName: propTypes.string,
  expanded: propTypes.arrayOf(orgUnitPathPropType),
  filter: propTypes.arrayOf(orgUnitPathPropType),

  /**
   * The parent already knows whether this node has children or not
   * before we load the children's details, so we can use this information
   * even during the loading phase
   */
  hasChildren: propTypes.bool,
  highlighted: propTypes.arrayOf(orgUnitPathPropType),
  isUserDataViewFallback: propTypes.bool,
  path: orgUnitPathPropType,
  selected: propTypes.arrayOf(orgUnitPathPropType),
  singleSelection: propTypes.bool,
  onCollapse: propTypes.func,
  onExpand: propTypes.func,
  onChildrenLoaded: propTypes.func
};

const RootError = ({ dataTest, error }) =>
  React.createElement(
    "div",
    {
      "data-test": "".concat(dataTest, "-loading")
    },
    i18n.t("Error: "),
    error
  );
RootError.propTypes = {
  dataTest: propTypes$1.string.isRequired,
  error: propTypes$1.string.isRequired
};

const RootLoading = ({ dataTest }) =>
  React.createElement(
    "div",
    {
      "data-test": "".concat(dataTest, "-loading"),
      className: "jsx-814846266"
    },
    React.createElement(CircularLoader, {
      small: true
    }),
    React.createElement(
      _JSXStyle,
      {
        id: "814846266"
      },
      [
        "div.jsx-814846266{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}"
      ]
    )
  );
RootLoading.propTypes = {
  dataTest: propTypes$1.string.isRequired
};

/**
 * @param {string} path
 * @returns {string[]}
 */
const extractAllPathsFromPath = (path) => {
  // remove leading slash and split by path delimiter/slashes
  const segments = path.replace(/^\//, "").split("/");
  const withSubPaths = segments.map((segment, index) => {
    // take all segments from 0 to index and join them with the delimiter
    return "/".concat(segments.slice(0, index + 1).join("/"));
  });
  return withSubPaths;
};
/**
 * @param {string[]} initiallyExpanded
 * @returns {string[]}
 */

const getInitiallyExpandedPaths = (initiallyExpanded) =>
  initiallyExpanded.reduce((all, curPath) => {
    const allPathsInCurPath = extractAllPathsFromPath(curPath);
    return [...all, ...allPathsInCurPath];
  }, []);
/**
 * @param {Object} args
 * @param {string[]} args.expanded
 * @param {Function} args.setExpanded
 * @param {Function} [args.onExpand]
 * @param {Function} [args.onCollapse]
 * @returns {{ handleExpand: Function, handleCollapse: Function }}
 */

const createExpandHandlers = ({ expanded, setExpanded, onExpand, onCollapse }) => {
  const handleExpand = (_ref) => {
    let { path } = _ref,
      rest = _objectWithoutProperties(_ref, ["path"]);

    if (!expanded.includes(path)) {
      setExpanded([...expanded, path]);

      if (onExpand) {
        onExpand(
          _objectSpread2(
            {
              path
            },
            rest
          )
        );
      }
    }
  };

  const handleCollapse = (_ref2) => {
    let { path } = _ref2,
      rest = _objectWithoutProperties(_ref2, ["path"]);

    const pathIndex = expanded.indexOf(path);

    if (pathIndex !== -1) {
      const updatedExpanded =
        pathIndex === 0 ? expanded.slice(1) : [...expanded.slice(0, pathIndex), ...expanded.slice(pathIndex + 1)];
      setExpanded(updatedExpanded);

      if (onCollapse) {
        onCollapse(
          _objectSpread2(
            {
              path
            },
            rest
          )
        );
      }
    }
  };

  return {
    handleExpand,
    handleCollapse
  };
};

/**
 * @param {string[]} initiallyExpanded
 * @param {Function} [onExpand]
 * @param {Function} [onCollapse]
 * @returns {{ expanded: string[], handleExpand: Function, handleCollapse: Function }}
 */

const useExpanded = (initiallyExpanded, onExpand, onCollapse) => {
  const allInitiallyExpandedPaths = getInitiallyExpandedPaths(initiallyExpanded);
  const [expanded, setExpanded] = useState(allInitiallyExpandedPaths);
  const { handleExpand, handleCollapse } = createExpandHandlers({
    expanded,
    setExpanded,
    onExpand,
    onCollapse
  });
  return {
    expanded,
    handleExpand,
    handleCollapse
  };
};

/**
 * This will create a new reloadId everytime "forceReload" changes to true,
 * which can be used as the "key" prop on the org unit tree.
 * When that id changes, the whole tree rerenders
 * and therefore triggers all "useDataQuery"s to
 * run the query again
 *
 * @param {bool} forceReload
 * @returns {Int}
 */

const useForceReload = (forceReload) => {
  const [reloadId, setReloadId] = useState(0);
  useEffect(() => {
    forceReload === true && setReloadId(reloadId + 1);
  }, [forceReload]);
  return reloadId;
};

/**
 * @module
 * @param {OrganisationUnitTree.PropTypes} props
 * @returns {React.Component}
 *
 * @example
 * import { OrganisationUnitTree } from '@dhis2/ui-widgets'
 *
 * @example
 * <OrganisationUnitTree
 *     name="Root org unit"
 *     roots="A0000000000"
 *     onChange={onChange}
 *     onExpand={onExpand}
 *     onCollapse={onCollapse}
 *     onChildrenLoaded={onChildrenLoaded}
 *     initiallyExpanded={['/A0000000000/A0000000001']}
 *     filter={['/A0000000000/A0000000001/A0000000003']}
 * />
 *
 * @see Specification: {@link https://github.com/dhis2/design-system/blob/master/organisms/organisation-unit-tree/org-unit-tree.md|Design system}
 * @see Live demo: {@link /demo/?path=/story/organisationunittree--collapsed|Storybook}
 */

const OrganisationUnitTree = ({
  onChange,
  roots,
  autoExpandLoadingError,
  dataTest,
  disableSelection,
  forceReload,
  highlighted,
  isUserDataViewFallback,
  initiallyExpanded,
  filter,
  selected,
  singleSelection,
  onExpand,
  onCollapse,
  onChildrenLoaded
}) => {
  const rootIds = Array.isArray(roots) ? roots : [roots];
  const reloadId = useForceReload(forceReload);
  const { loading, error, data, refetch } = useOrgData(rootIds, {
    withChildren: false,
    isUserDataViewFallback
  });
  const { expanded, handleExpand, handleCollapse } = useExpanded(initiallyExpanded, onExpand, onCollapse);
  useEffect(() => {
    // do not refetch on initial render
    if (refetch && reloadId > 0) {
      refetch();
    }
  }, [reloadId, refetch]);
  return React.createElement(
    "div",
    {
      "data-test": dataTest
    },
    error &&
      React.createElement(RootError, {
        error: error,
        dataTest: dataTest
      }),
    loading &&
      React.createElement(RootLoading, {
        dataTest: dataTest
      }),
    !error &&
      !loading &&
      rootIds.map((rootId) => {
        const rootNode = data[rootId];
        const rootPath = "/".concat(rootId);
        return React.createElement(OrganisationUnitNode, {
          key: rootPath,
          autoExpandLoadingError: autoExpandLoadingError,
          dataTest: dataTest,
          disableSelection: disableSelection,
          displayName: rootNode.displayName,
          expanded: expanded,
          highlighted: highlighted,
          id: rootId,
          isUserDataViewFallback: isUserDataViewFallback,
          filter: filter,
          path: rootPath,
          selected: selected,
          singleSelection: singleSelection,
          onChange: onChange,
          onChildrenLoaded: onChildrenLoaded,
          onCollapse: handleCollapse,
          onExpand: handleExpand
        });
      })
  );
};
/**
 * @typedef {Object} PropTypes
 * @static
 *
 * @prop {string|string[]} roots
 * Root org unit id(s)
 *
 * @prop {Function} onChange
 * Will be called with the following object
 * { id: string; path: string; checked: boolean; }
 *
 * @prop {bool} [autoExpandLoadingError]
 * When set, the error when loading children
 * fails will be shown automaticlly
 *
 * @prop {bool} [singleSelection]
 * When set, no checkboxes will be displayed and only the first selected path
 * in `selected` will be highlighted
 *
 * @prop {bool} [disableSelection]
 * When set to true, no unit can be selected
 *
 * @prop {string[]} [filter]
 * All organisation units with a path that inclused the provided
 * paths will be shown. All others will not be rendered.
 * When not provided, all org units will be shown.
 *
 * @prop {bool} [forceReload]
 * When set to "true", everything will be reloaded.
 * In order to load it again after reloading,
 * "forceReload" has to be set to false and then to true again
 *
 * @prop {string[]} [selected]
 * An array of paths of selected OUs.
 * The path of an OU is the UIDs of the OU and all its parent OUs separated
 * by slashes (/)
 *
 * @prop {string[]} [initiallyExpanded]
 * An array of OU paths that will be expanded automatically
 * as soon as they are encountered.
 * The path of an OU is the UIDs of the OU
 * and all its parent OUs separated by slashes (/)
 * Note: This replaces "openFirstLevel" as that's redundant
 *
 * @prop {bool} [isUserDataViewFallback]
 * When provided, the "isUserDataViewFallback" option will be send when
 * requesting the org units
 *
 * @prop {string[]} [highlighted]
 * All units provided to "highlighted" as path will be visually
 * highlighted.
 * Note:
 * The d2-ui component used two props for this:
 * * searchResults
 * * highlightSearchResults
 *
 * @prop {Function} [onExpand]
 * Called with { path: string }
 * with the path of the parent of the level opened
 *
 * @prop {Function} [onCollapse]
 * Called with { path: string }
 * with the path of the parent of the level closed
 *
 * @prop {Function} [onChildrenLoaded]
 * Called with the children's data that was loaded
 */

OrganisationUnitTree.propTypes = {
  roots: propTypes$1.oneOfType([propTypes$1.string, propTypes$1.arrayOf(propTypes$1.string)]).isRequired,
  onChange: propTypes$1.func.isRequired,
  autoExpandLoadingError: propTypes$1.bool,
  dataTest: propTypes$1.string,
  disableSelection: propTypes$1.bool,
  filter: propTypes$1.arrayOf(orgUnitPathPropType),
  forceReload: propTypes$1.bool,
  highlighted: propTypes$1.arrayOf(orgUnitPathPropType),
  initiallyExpanded: propTypes$1.arrayOf(orgUnitPathPropType),
  isUserDataViewFallback: propTypes$1.bool,
  selected: propTypes$1.arrayOf(orgUnitPathPropType),
  singleSelection: propTypes$1.bool,
  onChildrenLoaded: propTypes$1.func,
  onCollapse: propTypes$1.func,
  onExpand: propTypes$1.func
  /**
   * @prop {string[]} [idsThatShouldBeReloaded]
   * All units with ids (not paths!) provided
   * to "idsThatShouldBeReloaded" will be reloaded
   * In order to reload an id twice, the array must be changed
   * while keeping the id to reload in the array
   *
   * NOTE: This is currently not working due to a limitation
   * of the data engine (we can't force specific resource to reload,
   * we'd have to reload the sibling nodes currently as well)
   */
  //idsThatShouldBeReloaded: propTypes.arrayOf(orgUnitIdPropType),
};
OrganisationUnitTree.defaultProps = {
  dataTest: "dhis2-uiwidgets-orgunittree",
  filter: [],
  highlighted: [],
  initiallyExpanded: [],
  selected: []
};

export { HeaderBar, OrganisationUnitTree };
//# sourceMappingURL=lib.js.map
