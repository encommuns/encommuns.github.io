// Generated by CoffeeScript 1.8.0
(function() {
  var module;

  module = angular.module("imagination.catalog.controllers", ['commons.graffiti.controllers', "commons.accounts.controllers", "commons.accounts.services", 'commons.base.services', 'commons.catalog.services']);

  module.controller("ImaginationFilterCtrl", function($scope, $state, $stateParams, $q, DataSharing, Tag, FilterService, ProjectSheet) {
    "Controller in charge of updating filter parameters and suggested tags";
    console.log(" Init ImaginationFilter Ctrl , state param ?", $stateParams);
    $scope.updateSuggestedTags = function() {
      "update suggested tags by asking remaining facets : use tags_list and default \"site tags\" as selected facets";
      var facet_list, tag, _i, _len, _ref, _results;
      facet_list = $scope.tags_filter_flat;
      if (config.defaultSiteTags) {
        facet_list = $scope.tags_filter_flat.concat(config.defaultSiteTags);
      }
      if ((config.editorialSuggestedTags.length > 1) && ($scope.tags_filter_flat.length < 1)) {
        $scope.suggestedTags = [];
        _ref = config.editorialSuggestedTags;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          _results.push($scope.suggestedTags.push({
            name: tag
          }));
        }
        return _results;
      } else {
        switch ($scope.objectType) {
          case 'project':
            return $scope.suggestedTags = ProjectSheet.one().customGETLIST('search', {
              auto: '',
              facet: facet_list
            }).$object;
          case 'profile':
            return $scope.suggestedTags = [];
        }
      }
    };
    $scope.refreshFilter = function() {
      "Update FilterService data (query and tags) and suggested tags list";
      var tag, _i, _len, _ref;
      console.log("refreshing filter (ctrler).. ", $scope.tags_filter);
      $scope.tags_filter_flat = [];
      _ref = $scope.tags_filter;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        $scope.tags_filter_flat.push(tag.text);
      }
      console.log("refreshing filter (ctrler) tags_filter_flat : ", $scope.tags_filter_flat);
      FilterService.filterParams.tags = $scope.tags_filter_flat;
      FilterService.filterParams.query = $scope.query_filter;
      $state.go('project.list', {
        tag: $scope.tags_filter_flat,
        query: $scope.query_filter
      }, {
        notify: false
      });
      return $scope.updateSuggestedTags();
    };
    $scope.addToTagsFilter = function(aTag) {
      " If not already there, add aTag from suggested tags to tags filter list (flat+object) ";
      var simpleTag;
      console.log(" Adding tag to filter, aTag :  ", aTag);
      if ($scope.tags_filter_flat.indexOf(aTag.name) === -1) {
        $scope.tags_filter_flat.push(aTag.name);
        simpleTag = {
          text: aTag.name
        };
        console.log(" Adding tag to filter, simpleTag : ", simpleTag);
        $scope.tags_filter.push(simpleTag);
      }
      return $scope.refreshFilter();
    };
    $scope.load = function(objectType) {
      var e, tag, tagFilterObject, _i, _len, _ref;
      console.log(" loading FilterCtrl for type : ", objectType);
      console.log(" loading FilterCtrl date shared  : ", DataSharing.sharedObject);
      console.log(" loading FilterCtrl date shared typeof  : ", typeof DataSharing.sharedObject.stateParamTag);
      $scope.objectType = objectType;
      $scope.tags_filter = [];
      $scope.tags_filter_flat = [];
      $scope.query_filter = '';
      $scope.suggestedTags = [];
      try {
        if (DataSharing.sharedObject.stateParamTag && DataSharing.sharedObject.stateParamTag !== '') {
          if (typeof DataSharing.sharedObject.stateParamTag === 'string') {
            tagFilterObject = {
              text: DataSharing.sharedObject.stateParamTag
            };
            $scope.tags_filter.push(tagFilterObject);
            $scope.tags_filter_flat.push(tagFilterObject.text);
          } else {
            _ref = DataSharing.sharedObject.stateParamTag;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              tag = _ref[_i];
              tagFilterObject = {
                text: tag
              };
              $scope.tags_filter.push(tagFilterObject);
              $scope.tags_filter_flat.push(tagFilterObject.text);
            }
          }
        }
        if (DataSharing.sharedObject.stateParamQuery && DataSharing.sharedObject.stateParamQuery !== '') {
          $scope.query_filter = DataSharing.sharedObject.stateParamQuery;
        }
      } catch (_error) {
        e = _error;
        $scope.updateSuggestedTags();
      }
      console.log(" loaded ImaginationFilterCtrl ");
      return $scope.updateSuggestedTags();
    };
    return $scope.autocompleteFacetedTags = function(query) {
      " Method to update suggested tags for autocomplete with remaining faceted tags ";
      var deferred, facet_list;
      facet_list = $scope.tags_filter_flat;
      if (config.defaultSiteTags) {
        facet_list = facet_list.concat(config.defaultSiteTags);
      }
      deferred = $q.defer();
      return ProjectSheet.one().customGETLIST('search', {
        auto: query,
        facet: facet_list
      }).then(function(tags) {
        var availableTags;
        availableTags = [];
        angular.forEach(tags, function(tag) {
          var tmpTag;
          tag.name = tag.name.toLowerCase();
          query = query.toLowerCase();
          tmpTag = {
            'text': tag.name
          };
          return availableTags.push(tmpTag);
        });
        deferred.resolve(availableTags);
        return deferred.promise;
      });
    };
  });

  module.controller("ImaginationProjectSheetCreateCtrl", function($scope, $state, $controller, Project, ProjectSheet, TaggedItem, Profile, ObjectProfileLink) {
    $controller('ProjectSheetCreateCtrl', {
      $scope: $scope
    });
    $scope.tags = [];
    return $scope.saveImaginationProject = function(formIsValid) {
      if (!formIsValid) {
        console.log(" Form invalid !");
        return false;
      } else {
        console.log("submitting form");
      }
      return $scope.saveProject().then(function(projectsheetResult) {
        var tag, tag_data, _i, _len, _ref;
        console.log(" Just saved project : Result from savingProject : ", projectsheetResult);
        _ref = config.defaultSiteTags;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          tag_data = {
            text: tag
          };
          $scope.tags.push(tag_data);
        }
        angular.forEach($scope.tags, function(tag) {
          return TaggedItem.one().customPOST({
            tag: tag.text
          }, "project/" + projectsheetResult.project.id, {});
        });
        $scope.saveVideos(projectsheetResult.id);
        if ($scope.uploader.queue.length <= 0) {
          return $state.go("project.detail", {
            projectsheet_id: projectsheetResult.id,
            editMode: 'on'
          });
        } else {
          $scope.savePhotos(projectsheetResult.id, projectsheetResult.bucket.id);
          return $scope.uploader.onCompleteAll = function() {
            return $state.go("project.detail", {
              projectsheet_id: projectsheetResult.id,
              editMode: 'on'
            });
          };
        }
      });
    };
  });

  module.controller("ImaginationProjectSheetCtrl", function($rootScope, $scope, $stateParams, $controller, $modal, Project, ProjectSheet, TaggedItem, ObjectProfileLink, DataSharing, ProjectSheetTemplate, ProjectSheetQuestionAnswer, PostalAddress, geolocation) {
    $controller('ProjectSheetCtrl', {
      $scope: $scope,
      $stateParams: $stateParams
    });
    $controller('TaggedItemCtrl', {
      $scope: $scope
    });
    $scope.preparedTags = [];
    $scope.currentUserHasEditRights = false;
    console.log(" stateParams ? ", $stateParams);
    if ($stateParams.editMode === 'on') {
      $scope.editable = true;
    } else {
      $scope.editable = false;
    }
    $scope.countryData = [
      {
        "id": "AF",
        "text": "Afghanistan"
      }, {
        "id": "AX",
        "text": "Åland Islands"
      }, {
        "id": "AL",
        "text": "Albania"
      }, {
        "id": "DZ",
        "text": "Algeria"
      }, {
        "id": "AS",
        "text": "American Samoa"
      }, {
        "id": "AD",
        "text": "Andorra"
      }, {
        "id": "AO",
        "text": "Angola"
      }, {
        "id": "AI",
        "text": "Anguilla"
      }, {
        "id": "AQ",
        "text": "Antarctica"
      }, {
        "id": "AG",
        "text": "Antigua and Barbuda"
      }, {
        "id": "AR",
        "text": "Argentina"
      }, {
        "id": "AM",
        "text": "Armenia"
      }, {
        "id": "AW",
        "text": "Aruba"
      }, {
        "id": "AU",
        "text": "Australia"
      }, {
        "id": "AT",
        "text": "Austria"
      }, {
        "id": "AZ",
        "text": "Azerbaijan"
      }, {
        "id": "BS",
        "text": "Bahamas"
      }, {
        "id": "BH",
        "text": "Bahrain"
      }, {
        "id": "BD",
        "text": "Bangladesh"
      }, {
        "id": "BB",
        "text": "Barbados"
      }, {
        "id": "BY",
        "text": "Belarus"
      }, {
        "id": "BE",
        "text": "Belgium"
      }, {
        "id": "BZ",
        "text": "Belize"
      }, {
        "id": "BJ",
        "text": "Benin"
      }, {
        "id": "BM",
        "text": "Bermuda"
      }, {
        "id": "BT",
        "text": "Bhutan"
      }, {
        "id": "BO",
        "text": "Bolivia"
      }, {
        "id": "BQ",
        "text": "Bonaire"
      }, {
        "id": "BA",
        "text": "Bosnia and Herzegovina"
      }, {
        "id": "BW",
        "text": "Botswana"
      }, {
        "id": "BV",
        "text": "Bouvet Island"
      }, {
        "id": "BR",
        "text": "Brazil"
      }, {
        "id": "IO",
        "text": "British Indian Ocean Territory"
      }, {
        "id": "VG",
        "text": "British Virgin Islands"
      }, {
        "id": "BN",
        "text": "Brunei"
      }, {
        "id": "BG",
        "text": "Bulgaria"
      }, {
        "id": "BF",
        "text": "Burkina Faso"
      }, {
        "id": "BI",
        "text": "Burundi"
      }, {
        "id": "KH",
        "text": "Cambodia"
      }, {
        "id": "CM",
        "text": "Cameroon"
      }, {
        "id": "CA",
        "text": "Canada"
      }, {
        "id": "CV",
        "text": "Cape Verde"
      }, {
        "id": "KY",
        "text": "Cayman Islands"
      }, {
        "id": "CF",
        "text": "Central African Republic"
      }, {
        "id": "TD",
        "text": "Chad"
      }, {
        "id": "CL",
        "text": "Chile"
      }, {
        "id": "CN",
        "text": "China"
      }, {
        "id": "CX",
        "text": "Christmas Island"
      }, {
        "id": "CC",
        "text": "Cocos (Keeling) Islands"
      }, {
        "id": "CO",
        "text": "Colombia"
      }, {
        "id": "KM",
        "text": "Comoros"
      }, {
        "id": "CG",
        "text": "Republic of the Congo"
      }, {
        "id": "CD",
        "text": "DR Congo"
      }, {
        "id": "CK",
        "text": "Cook Islands"
      }, {
        "id": "CR",
        "text": "Costa Rica"
      }, {
        "id": "HR",
        "text": "Croatia"
      }, {
        "id": "CU",
        "text": "Cuba"
      }, {
        "id": "CW",
        "text": "Curaçao"
      }, {
        "id": "CY",
        "text": "Cyprus"
      }, {
        "id": "CZ",
        "text": "Czech Republic"
      }, {
        "id": "DK",
        "text": "Denmark"
      }, {
        "id": "DJ",
        "text": "Djibouti"
      }, {
        "id": "DM",
        "text": "Dominica"
      }, {
        "id": "DO",
        "text": "Dominican Republic"
      }, {
        "id": "EC",
        "text": "Ecuador"
      }, {
        "id": "EG",
        "text": "Egypt"
      }, {
        "id": "SV",
        "text": "El Salvador"
      }, {
        "id": "GQ",
        "text": "Equatorial Guinea"
      }, {
        "id": "ER",
        "text": "Eritrea"
      }, {
        "id": "EE",
        "text": "Estonia"
      }, {
        "id": "ET",
        "text": "Ethiopia"
      }, {
        "id": "FK",
        "text": "Falkland Islands"
      }, {
        "id": "FO",
        "text": "Faroe Islands"
      }, {
        "id": "FJ",
        "text": "Fiji"
      }, {
        "id": "FI",
        "text": "Finland"
      }, {
        "id": "FR",
        "text": "France"
      }, {
        "id": "GF",
        "text": "French Guiana"
      }, {
        "id": "PF",
        "text": "French Polynesia"
      }, {
        "id": "TF",
        "text": "French Southern and Antarctic Lands"
      }, {
        "id": "GA",
        "text": "Gabon"
      }, {
        "id": "GM",
        "text": "Gambia"
      }, {
        "id": "GE",
        "text": "Georgia"
      }, {
        "id": "DE",
        "text": "Germany"
      }, {
        "id": "GH",
        "text": "Ghana"
      }, {
        "id": "GI",
        "text": "Gibraltar"
      }, {
        "id": "GR",
        "text": "Greece"
      }, {
        "id": "GL",
        "text": "Greenland"
      }, {
        "id": "GD",
        "text": "Grenada"
      }, {
        "id": "GP",
        "text": "Guadeloupe"
      }, {
        "id": "GU",
        "text": "Guam"
      }, {
        "id": "GT",
        "text": "Guatemala"
      }, {
        "id": "GG",
        "text": "Guernsey"
      }, {
        "id": "GN",
        "text": "Guinea"
      }, {
        "id": "GW",
        "text": "Guinea-Bissau"
      }, {
        "id": "GY",
        "text": "Guyana"
      }, {
        "id": "HT",
        "text": "Haiti"
      }, {
        "id": "HM",
        "text": "Heard Island and McDonald Islands"
      }, {
        "id": "VA",
        "text": "Vatican City"
      }, {
        "id": "HN",
        "text": "Honduras"
      }, {
        "id": "HK",
        "text": "Hong Kong"
      }, {
        "id": "HU",
        "text": "Hungary"
      }, {
        "id": "IS",
        "text": "Iceland"
      }, {
        "id": "IN",
        "text": "India"
      }, {
        "id": "ID",
        "text": "Indonesia"
      }, {
        "id": "CI",
        "text": "Ivory Coast"
      }, {
        "id": "IR",
        "text": "Iran"
      }, {
        "id": "IQ",
        "text": "Iraq"
      }, {
        "id": "IE",
        "text": "Ireland"
      }, {
        "id": "IM",
        "text": "Isle of Man"
      }, {
        "id": "IL",
        "text": "Israel"
      }, {
        "id": "IT",
        "text": "Italy"
      }, {
        "id": "JM",
        "text": "Jamaica"
      }, {
        "id": "JP",
        "text": "Japan"
      }, {
        "id": "JE",
        "text": "Jersey"
      }, {
        "id": "JO",
        "text": "Jordan"
      }, {
        "id": "KZ",
        "text": "Kazakhstan"
      }, {
        "id": "KE",
        "text": "Kenya"
      }, {
        "id": "KI",
        "text": "Kiribati"
      }, {
        "id": "KW",
        "text": "Kuwait"
      }, {
        "id": "KG",
        "text": "Kyrgyzstan"
      }, {
        "id": "LA",
        "text": "Laos"
      }, {
        "id": "LV",
        "text": "Latvia"
      }, {
        "id": "LB",
        "text": "Lebanon"
      }, {
        "id": "LS",
        "text": "Lesotho"
      }, {
        "id": "LR",
        "text": "Liberia"
      }, {
        "id": "LY",
        "text": "Libya"
      }, {
        "id": "LI",
        "text": "Liechtenstein"
      }, {
        "id": "LT",
        "text": "Lithuania"
      }, {
        "id": "LU",
        "text": "Luxembourg"
      }, {
        "id": "MO",
        "text": "Macau"
      }, {
        "id": "MK",
        "text": "Macedonia"
      }, {
        "id": "MG",
        "text": "Madagascar"
      }, {
        "id": "MW",
        "text": "Malawi"
      }, {
        "id": "MY",
        "text": "Malaysia"
      }, {
        "id": "MV",
        "text": "Maldives"
      }, {
        "id": "ML",
        "text": "Mali"
      }, {
        "id": "MT",
        "text": "Malta"
      }, {
        "id": "MH",
        "text": "Marshall Islands"
      }, {
        "id": "MQ",
        "text": "Martinique"
      }, {
        "id": "MR",
        "text": "Mauritania"
      }, {
        "id": "MU",
        "text": "Mauritius"
      }, {
        "id": "YT",
        "text": "Mayotte"
      }, {
        "id": "MX",
        "text": "Mexico"
      }, {
        "id": "FM",
        "text": "Micronesia"
      }, {
        "id": "MD",
        "text": "Moldova"
      }, {
        "id": "MC",
        "text": "Monaco"
      }, {
        "id": "MN",
        "text": "Mongolia"
      }, {
        "id": "ME",
        "text": "Montenegro"
      }, {
        "id": "MS",
        "text": "Montserrat"
      }, {
        "id": "MA",
        "text": "Morocco"
      }, {
        "id": "MZ",
        "text": "Mozambique"
      }, {
        "id": "MM",
        "text": "Myanmar"
      }, {
        "id": "NA",
        "text": "Namibia"
      }, {
        "id": "NR",
        "text": "Nauru"
      }, {
        "id": "NP",
        "text": "Nepal"
      }, {
        "id": "NL",
        "text": "Netherlands"
      }, {
        "id": "NC",
        "text": "New Caledonia"
      }, {
        "id": "NZ",
        "text": "New Zealand"
      }, {
        "id": "NI",
        "text": "Nicaragua"
      }, {
        "id": "NE",
        "text": "Niger"
      }, {
        "id": "NG",
        "text": "Nigeria"
      }, {
        "id": "NU",
        "text": "Niue"
      }, {
        "id": "NF",
        "text": "Norfolk Island"
      }, {
        "id": "KP",
        "text": "North Korea"
      }, {
        "id": "MP",
        "text": "Northern Mariana Islands"
      }, {
        "id": "NO",
        "text": "Norway"
      }, {
        "id": "OM",
        "text": "Oman"
      }, {
        "id": "PK",
        "text": "Pakistan"
      }, {
        "id": "PW",
        "text": "Palau"
      }, {
        "id": "PS",
        "text": "Palestine"
      }, {
        "id": "PA",
        "text": "Panama"
      }, {
        "id": "PG",
        "text": "Papua New Guinea"
      }, {
        "id": "PY",
        "text": "Paraguay"
      }, {
        "id": "PE",
        "text": "Peru"
      }, {
        "id": "PH",
        "text": "Philippines"
      }, {
        "id": "PN",
        "text": "Pitcairn Islands"
      }, {
        "id": "PL",
        "text": "Poland"
      }, {
        "id": "PT",
        "text": "Portugal"
      }, {
        "id": "PR",
        "text": "Puerto Rico"
      }, {
        "id": "QA",
        "text": "Qatar"
      }, {
        "id": "XK",
        "text": "Kosovo"
      }, {
        "id": "RE",
        "text": "Réunion"
      }, {
        "id": "RO",
        "text": "Romania"
      }, {
        "id": "RU",
        "text": "Russia"
      }, {
        "id": "RW",
        "text": "Rwanda"
      }, {
        "id": "BL",
        "text": "Saint Barthélemy"
      }, {
        "id": "SH",
        "text": "Saint Helena, Ascension and Tristan da Cunha"
      }, {
        "id": "KN",
        "text": "Saint Kitts and Nevis"
      }, {
        "id": "LC",
        "text": "Saint Lucia"
      }, {
        "id": "MF",
        "text": "Saint Martin"
      }, {
        "id": "PM",
        "text": "Saint Pierre and Miquelon"
      }, {
        "id": "VC",
        "text": "Saint Vincent and the Grenadines"
      }, {
        "id": "WS",
        "text": "Samoa"
      }, {
        "id": "SM",
        "text": "San Marino"
      }, {
        "id": "ST",
        "text": "São Tomé and Príncipe"
      }, {
        "id": "SA",
        "text": "Saudi Arabia"
      }, {
        "id": "SN",
        "text": "Senegal"
      }, {
        "id": "RS",
        "text": "Serbia"
      }, {
        "id": "SC",
        "text": "Seychelles"
      }, {
        "id": "SL",
        "text": "Sierra Leone"
      }, {
        "id": "SG",
        "text": "Singapore"
      }, {
        "id": "SX",
        "text": "Sint Maarten"
      }, {
        "id": "SK",
        "text": "Slovakia"
      }, {
        "id": "SI",
        "text": "Slovenia"
      }, {
        "id": "SB",
        "text": "Solomon Islands"
      }, {
        "id": "SO",
        "text": "Somalia"
      }, {
        "id": "ZA",
        "text": "South Africa"
      }, {
        "id": "GS",
        "text": "South Georgia"
      }, {
        "id": "KR",
        "text": "South Korea"
      }, {
        "id": "SS",
        "text": "South Sudan"
      }, {
        "id": "ES",
        "text": "Spain"
      }, {
        "id": "LK",
        "text": "Sri Lanka"
      }, {
        "id": "SD",
        "text": "Sudan"
      }, {
        "id": "SR",
        "text": "Suriname"
      }, {
        "id": "SJ",
        "text": "Svalbard and Jan Mayen"
      }, {
        "id": "SZ",
        "text": "Swaziland"
      }, {
        "id": "SE",
        "text": "Sweden"
      }, {
        "id": "CH",
        "text": "Switzerland"
      }, {
        "id": "SY",
        "text": "Syria"
      }, {
        "id": "TW",
        "text": "Taiwan"
      }, {
        "id": "TJ",
        "text": "Tajikistan"
      }, {
        "id": "TZ",
        "text": "Tanzania"
      }, {
        "id": "TH",
        "text": "Thailand"
      }, {
        "id": "TL",
        "text": "Timor-Leste"
      }, {
        "id": "TG",
        "text": "Togo"
      }, {
        "id": "TK",
        "text": "Tokelau"
      }, {
        "id": "TO",
        "text": "Tonga"
      }, {
        "id": "TT",
        "text": "Trinidad and Tobago"
      }, {
        "id": "TN",
        "text": "Tunisia"
      }, {
        "id": "TR",
        "text": "Turkey"
      }, {
        "id": "TM",
        "text": "Turkmenistan"
      }, {
        "id": "TC",
        "text": "Turks and Caicos Islands"
      }, {
        "id": "TV",
        "text": "Tuvalu"
      }, {
        "id": "UG",
        "text": "Uganda"
      }, {
        "id": "UA",
        "text": "Ukraine"
      }, {
        "id": "AE",
        "text": "United Arab Emirates"
      }, {
        "id": "GB",
        "text": "United Kingdom"
      }, {
        "id": "US",
        "text": "United States"
      }, {
        "id": "UM",
        "text": "United States Minor Outlying Islands"
      }, {
        "id": "VI",
        "text": "United States Virgin Islands"
      }, {
        "id": "UY",
        "text": "Uruguay"
      }, {
        "id": "UZ",
        "text": "Uzbekistan"
      }, {
        "id": "VU",
        "text": "Vanuatu"
      }, {
        "id": "VE",
        "text": "Venezuela"
      }, {
        "id": "VN",
        "text": "Vietnam"
      }, {
        "id": "WF",
        "text": "Wallis and Futuna"
      }, {
        "id": "EH",
        "text": "Western Sahara"
      }, {
        "id": "YE",
        "text": "Yemen"
      }, {
        "id": "ZM",
        "text": "Zambia"
      }, {
        "id": "ZW",
        "text": "Zimbabwe"
      }
    ];
    $scope.defaults = {
      scrollWheelZoom: true,
      maxZoom: 14,
      minZoom: 1
    };
    $scope.center = {
      lat: 46.43,
      lng: 2.35,
      zoom: 5
    };
    $scope.markers = [
      {
        lat: 46.43,
        lng: 2.35
      }
    ];
    $scope.showCountry = function(countryCode) {
      var selected_country;
      selected_country = _.find($scope.countryData, function(country) {
        return country.id === countryCode;
      });
      if (selected_country) {
        return selected_country.text;
      } else {
        return null;
      }
    };
    $scope.buildAddress = function() {
      var address;
      address = '';
      if ($scope.project.location.address && $scope.project.location.address.street_address) {
        address += $scope.project.location.address.street_address;
      }
      if ($scope.project.location.address && $scope.project.location.address.address_locality) {
        address += ', ' + $scope.project.location.address.address_locality;
      }
      if ($scope.project.location.address && $scope.project.location.address.country) {
        address += ', ';
        address += $scope.showCountry($scope.project.location.address.country);
      }
      return address;
    };
    $scope.addMarker = function(lat, lng, address) {
      var marker;
      marker = {
        lat: lat,
        lng: lng,
        message: address,
        icon: {
          type: 'awesomeMarker',
          prefix: 'fa',
          markerColor: "blue",
          iconColor: "white"
        }
      };
      $scope.markers = [marker];
      return $scope.center = {
        lat: lat,
        lng: lng,
        zoom: 3
      };
    };
    $scope.updateGeolocation = function(project_id) {
      var putData;
      putData = {
        location: {
          geo: {
            coordinates: [$scope.markers[0].lng, $scope.markers[0].lat],
            type: "Point"
          }
        }
      };
      if ($scope.project.location) {
        putData.location['id'] = $scope.project.location.id;
      }
      return Project.one(project_id).patch(putData).then(function(data) {
        console.log(" Updated GEO location!", data);
        return $scope.project = data;
      });
    };
    $scope.geocodeAddress = function() {
      var lookup_address, pos_promise;
      console.log("geocoding");
      lookup_address = $scope.buildAddress();
      return pos_promise = geolocation.lookupAddress(lookup_address).then(function(coords) {
        console.log(" found position !", coords);
        $scope.addMarker(coords[0], coords[1], lookup_address);
        if ($scope.editable) {
          return $scope.updateGeolocation($scope.projectsheet.project.id);
        }
      }, function(reason) {
        return console.log(" No place found", reason);
      });
    };
    $scope.loadGeocodedLocation = function() {
      var address, lat, lng;
      if ($scope.project.location && $scope.project.location.geo) {
        address = $scope.buildAddress();
        lat = $scope.project.location.geo.coordinates[1];
        lng = $scope.project.location.geo.coordinates[0];
        return $scope.addMarker(lat, lng, address);
      } else if ($scope.project.location && $scope.project.location.address) {
        console.log(" Try geocoding given address ");
        if ($scope.geocodeAddress()) {
          return console.log("[loadGeocodedLocation] Found location !");
        }
      }
    };
    $scope.isQuestionInQA = function(question, question_answers) {
      return _.find(question_answers, function(item) {
        return item.question.resource_uri === question.resource_uri;
      }) !== void 0;
    };
    $scope.populateQuestions = function() {
      if (!$scope.projectsheet.template.questions) {
        return ProjectSheetTemplate.one(getObjectIdFromURI($scope.projectsheet.template)).get().then(function(result) {
          var q_a, question, _i, _len, _ref, _results;
          $scope.projectsheet.template = result;
          console.log(" project sheet ready", $scope.projectsheet);
          _ref = $scope.projectsheet.template.questions;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            question = _ref[_i];
            console.log("Checking questions ? ", question);
            if (!$scope.isQuestionInQA(question, $scope.projectsheet.question_answers)) {
              console.log("posting new QA !");
              q_a = {
                question: question.resource_uri,
                answer: '',
                projectsheet: $scope.projectsheet.resource_uri
              };
              _results.push(ProjectSheetQuestionAnswer.post(q_a).then(function(result) {
                console.log("posted new QA ", result);
                return $scope.projectsheet.question_answers.push(result);
              }));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
      }
    };
    $scope.updateImaginationProjectSheet = function(resourceName, resourceId, fieldName, data) {
      var putData;
      putData = {};
      putData[fieldName] = data;
      switch (resourceName) {
        case 'Project':
          return Project.one(resourceId).patch(putData);
        case 'ProjectSheet':
          return ProjectSheet.one(resourceId).patch(putData);
      }
    };
    $scope.updateProjectAddress = function(resourceId, fieldName, data) {
      var putData;
      putData = {
        location: {
          address: {}
        }
      };
      if ($scope.project.location) {
        putData.location['id'] = $scope.project.location.id;
        if ($scope.project.location.address) {
          putData.location.address['id'] = $scope.project.location.address.id;
        }
        if ($scope.project.location.geo) {
          putData.location.geo = $scope.project.location.geo;
        }
      }
      putData.location.address[fieldName] = data;
      return Project.one(resourceId).patch(putData).then(function(data) {
        $scope.project['location'] = data.location;
        console.log(" created/updated project location!", $scope.project.location);
        return $scope.geocodeAddress();
      });
    };
    $scope.openGeocodingPopup = function() {
      var modalInstance;
      return modalInstance = $modal.open({
        templateUrl: 'views/catalog/block/geocoding.html',
        controller: 'GeocodingInstanceCtrl',
        size: 'lg',
        resolve: {
          params: function() {
            return {
              project: $scope.project,
              countryData: $scope.countryData,
              showCountry: $scope.showCountry
            };
          }
        }
      });
    };
    return ProjectSheet.one($stateParams.projectsheet_id).get().then(function(ProjectSheetResult) {
      $scope.projectsheet = ProjectSheetResult;
      $scope.project = $scope.projectsheet.project;
      DataSharing.sharedObject = {
        project: $scope.projectsheet.project
      };
      angular.forEach($scope.projectsheet.project.tags, function(taggedItem) {
        return $scope.preparedTags.push({
          text: taggedItem.tag.name,
          taggedItemId: taggedItem.id
        });
      });
      return $scope.loadGeocodedLocation();
    });
  });

  module.controller('GeocodingInstanceCtrl', function($scope, $rootScope, $modalInstance, params, geolocation) {
    console.log('Init GeocodingInstanceCtrl', params);
    $scope.project = params.project;
    $scope.countryData = params.countryData;
    $scope.showCountry = params.showCountry;
    $scope.markers = [];
    $scope.defaults = {
      scrollWheelZoom: true,
      maxZoom: 14,
      minZoom: 1
    };
    $scope.center = {
      lat: 46.43,
      lng: 2.35,
      zoom: 5
    };
    $scope.ok = function() {
      var geo;
      geo = {};
      return $modalInstance.close(geo);
    };
    $scope.cancel = function() {
      return $modalInstance.dismiss('cancel');
    };
    return $scope.geocode = function() {
      var lookup_address, pos_promise;
      lookup_address = '';
      if ($scope.project.location.address && $scope.project.location.address.street_address) {
        lookup_address += $scope.project.location.address.street_address;
      }
      if ($scope.project.location.address.country) {
        lookup_address += ', ';
        lookup_address += $scope.project.location.address.country;
      }
      return pos_promise = geolocation.lookupAddress(lookup_address).then(function(coords) {
        var marker;
        console.log(" found position !", coords);
        marker = {
          lat: coords[0],
          lng: coords[1]
        };
        $scope.markers = [marker];
        return $scope.center = {
          lat: coords[0],
          lng: coords[1],
          zoom: 6
        };
      });
    };
  });

}).call(this);
