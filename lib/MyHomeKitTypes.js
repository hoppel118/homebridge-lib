// homebridge-lib/lib/MyHomeKitTypes.js
//
// Library for Homebridge plugins.
// Copyright © 2017-2019 Erik Baauw. All rights reserved.
//
// My own collection of custom HomeKit Services and Characteristics.

const homebridgeLib = require('../index')

let hap

function uuid (id) {
  if (typeof id !== 'string' || id.length !== 3) {
    throw new TypeError(`${id}: illegal id`)
  }
  return `00000${id}-0000-1000-8000-656261617577`
}

/**
 * My own collection of custom HomeKit Services and Characteristics.
 * @extends CustomHomeKitTypes
 */
class MyHomeKitTypes extends homebridgeLib.CustomHomeKitTypes {
  /**
   * Create my custom HomeKit Services and Characteristics.
   * @param {object} homebridge - API object from homebridge
   */
  constructor (homebridge) {
    super(homebridge)
    hap = homebridge.hap

    // ===== Characteristics ===================================================

    /**
     * @member MyHomeKitTypes#Characteristic
     * @property {Characteristic} AnyOn - Any light of a group is on.
     * @property {Characteristic} Dark - LightLevel is below dark threshold.
     * @property {Characteristic} Daylight - LightLevel is above daylight threshold.
     * @property {Characteristic} Enabled - Enable/disable service.
     * @property {Characteristic} Heartrate - Refresh rate.
     * @property {Characteristic} LastTriggered - Date/time rule was last triggered.
     * @property {Characteristic} LastUpdated - Date/time service was last updated.
     * @property {Characteristic} Link - Link button on the Hue bridge.
     * @property {Characteristic} Resource - REST API resource corresponding for service.
     * @property {Characteristic} Status - Generic status.
     * @property {Characteristic} TimesTriggered - Number of times rule has been triggered.
     * @property {Characteristic} Touchlink - Initiate touchlink.
     * @property {Characteristic} TransitionTime - Transition time.
     */

    // Used by homebridge-hue.
    this.createCharacteristic('Resource', uuid('021'), {
      format: this.formats.STRING,
      perms: [this.perms.READ]
    })

    // Used by homebridge-hue.
    this.createCharacteristic('Enabled', uuid('022'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-hue.
    this.createCharacteristic('LastUpdated', uuid('023'), {
      format: this.formats.STRING,
      perms: [this.perms.READ, this.perms.NOTIFY]
    }, 'Last Updated')

    // Used by homebridge-hue in HueBridge service.
    this.createCharacteristic('Heartrate', uuid('024'), {
      format: this.formats.UINT8,
      unit: this.units.SECONDS,
      minValue: 1,
      maxValue: 30,
      minStep: 1,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-hue in LightSensor service.
    this.createCharacteristic('Dark', uuid('025'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY]
    })

    // Used by homebridge-hue in LightSensor service.
    this.createCharacteristic('Daylight', uuid('026'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY]
    })

    // Used by homebridge-hue in Status service.
    this.createCharacteristic('Status', uuid('027'), {
      format: this.formats.INT,
      // Eve 3.1 displays the following controls, depending on the properties:
      // 1. {minValue: 0, maxValue: 1, minStep: 1}                    switch
      // 2. {minValue: a, maxValue: b, minStep: 1}, 1 < b - a <= 20   down|up
      // 3. {minValue: a, maxValue: b}, (a, b) != (0, 1)              slider
      // 4. {minValue: a, maxValue: b, minStep: 1}, b - a > 20        slider
      // Avoid the following bugs:
      // 5. {minValue: 0, maxValue: 1}                                nothing
      // 6. {minValue: a, maxValue: b, minStep: 1}, b - a = 1         switch*
      //    *) switch sends values 0 and 1 instead of a and b;
      minValue: -127,
      maxValue: 127,
      // Don't specify minStep here, so plugins can select the Eve control.
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-hue in for group LightBulb or Switch service.
    this.createCharacteristic('AnyOn', uuid('028'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE
      ]
    })

    // Used by homebridge-hue in Resource service.
    this.createCharacteristic('LastTriggered', uuid('029'), {
      format: this.formats.STRING,
      perms: [this.perms.READ, this.perms.NOTIFY]
    }, 'Last Triggered')

    // Used by homebridge-hue in Resource service.
    this.createCharacteristic('TimesTriggered', uuid('02A'), {
      format: this.formats.INT,
      perms: [this.perms.READ, this.perms.NOTIFY]
    }, 'Times Triggered')

    // Used by homebridge-hue in MotionSensor service.
    // Deprecated in favour of Eve's Sensitivity characteristic.
    this.createCharacteristic('Sensitivity', uuid('02B'), {
      format: this.formats.UINT8,
      minValue: 0,
      maxValue: 127,
      minStep: 1,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-hue in MotionSensor service.
    // Deprecated in favour of Eve's Durarion characteristic.
    this.createCharacteristic('Duration', uuid('02C'), {
      format: this.formats.UINT16,
      unit: this.units.SECONDS,
      minValue: 0,
      maxValue: 7200,
      minStep: 1,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-hue in HueBridge service.
    this.createCharacteristic('Link', uuid('02D'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-hue in HueBridge service.
    this.createCharacteristic('Touchlink', uuid('02E'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-hue in HueBridge service.
    this.createCharacteristic('TransitionTime', uuid('02F'), {
      format: this.formats.FLOAT,
      unit: this.units.SECONDS,
      minValue: 0,
      maxValue: 3600,
      minStep: 0.1,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    }, 'Transition Time')

    // Used by homebridge-hue in Temperature service.
    this.createCharacteristic('Offset', uuid('030'), {
      format: this.formats.FLOAT,
      unit: this.units.CELSIUS,
      maxValue: 5,
      minValue: -5,
      minStep: 0.1,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-p1 in Electricity service.
    this.createCharacteristic('Tariff', uuid('031'), {
      format: this.formats.STRING,
      perms: [this.perms.READ, this.perms.NOTIFY]
    })

    // Used by homebridge-hue for Alarm service.
    this.createCharacteristic('Alarm', uuid('032'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY]
    })

    // Used by homebridge-hue for Daylight sensor.
    this.createCharacteristic('Period', uuid('033'), {
      format: this.formats.STRING,
      perms: [this.perms.READ, this.perms.NOTIFY]
    })

    // Used by homebridge-hue for Daylight sensor.
    this.createCharacteristic('LastEvent', uuid('034'), {
      format: this.formats.STRING,
      perms: [this.perms.READ, this.perms.NOTIFY]
    }, 'Last Event')

    // Used by homebridge-zp in Speaker service.
    this.createCharacteristic('Bass', uuid('041'), {
      format: this.formats.INT,
      minValue: -10,
      maxValue: 10,
      minStep: 1,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-zp in Speaker service.
    this.createCharacteristic('Treble', uuid('042'), {
      format: this.formats.INT,
      minValue: -10,
      maxValue: 10,
      minStep: 1,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-zp in Speaker service.
    this.createCharacteristic('Loudness', uuid('043'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY,
        this.perms.WRITE]
    })

    // Used by homebridge-zp in Speaker service.
    this.createCharacteristic('Balance', uuid('044'), {
      format: this.formats.INT,
      minValue: -10,
      maxValue: 10,
      minStep: 1,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    })

    // Used by homebridge-zp in Sonos service.
    this.createCharacteristic('CurrentTrack', uuid('045'), {
      format: this.formats.STRING,
      perms: [this.perms.READ, this.perms.NOTIFY]
    }, 'Track')

    // Used by homebridge-zp in Sonos service.
    this.createCharacteristic('SonosGroup', uuid('046'), {
      format: this.formats.STRING,
      perms: [this.perms.READ, this.perms.NOTIFY]
    }, 'Sonos Group')

    // Used by homebridge-zp in Sonos service.
    this.createCharacteristic('ChangeTrack', uuid('047'), {
      format: this.formats.INT,
      minValue: -1,
      maxValue: 1,
      minStep: 1, // Force Down|Up control in Eve
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    }, 'Track Change')

    // Used by homebridge-zp in Sonos and Speaker service.
    this.createCharacteristic('ChangeVolume', uuid('049'), {
      format: this.formats.INT,
      minValue: -10,
      maxValue: 10,
      minStep: 1, // Force Down|Up control in Eve
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    }, 'Volume Change')

    // Used by homebridge-zp in Sonos service.
    this.createCharacteristic('ChangeInput', uuid('04A'), {
      format: this.formats.INT,
      minValue: -1,
      maxValue: 1,
      minStep: 1, // Force Down|Up control in Eve
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    }, 'Input Change')

    // Used by homebridge-zp in Speaker service.
    this.createCharacteristic('NightSound', uuid('04B'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    }, 'Night Sound')

    // Used by homebridge-zp in Speaker service.
    this.createCharacteristic('SpeechEnhancement', uuid('04C'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    }, 'Speech Enhancement')

    // Used by homebridge-zp in Sonos service.
    this.createCharacteristic('SonosCoordinator', uuid('04D'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY, this.perms.WRITE]
    }, 'Sonos Coordinator')

    // Used by homebridge-zp in Sonos service.
    this.createCharacteristic('TV', uuid('04E'), {
      format: this.formats.BOOL,
      perms: [this.perms.READ, this.perms.NOTIFY]
    }, 'TV')

    // Characteristic for Unique ID, used by homebridge-hue.
    // Source: as exposed by the Philips Hue bridge.  This characteristic is
    // used by the Hue app to select the accessories when syncing Hue bridge
    // Room groups to HomeKit rooms.
    this.createCharacteristic(
      'UniqueID', 'D8B76298-42E7-5FFD-B1D6-1782D9A1F936', {
        format: this.formats.STRING,
        perms: [this.perms.READ]
      }, 'Unique ID'
    )

    // ===== Services ==========================================================

    // Used by homebridge-hue for a schedule or rule.
    this.createService('Resource', uuid('011'), [], [
      this.Characteristic.LastTriggered,
      this.Characteristic.TimesTriggered,
      hap.Characteristic.StatusActive,
      this.Characteristic.Enabled,
      this.Characteristic.Resource
    ])

    // Used by homebridge-hue for a Hue bridge or deCONZ gateway.
    this.createService('HueBridge', uuid('012'), [
      this.Characteristic.Heartrate,
      this.Characteristic.LastUpdated,
      this.Characteristic.TransitionTime
    ], [
      this.Characteristic.Link,
      this.Characteristic.Touchlink
    ])

    // Used by homebridge-hue for a CLIPGenericStatus sensor.
    this.createService('Status', uuid('013'), [
      this.Characteristic.Status
    ])

    // Used by homebridge-zp.
    this.createService('Alarm', uuid('048'), [
      this.Characteristic.Enabled
    ])

    // Used by homebridge-zp.
    // Note that a different UUID might be used depending on the config.json
    // setting for "service".
    this.createService('Sonos', hap.Service.Switch.UUID, [
      hap.Characteristic.On,
      hap.Characteristic.Volume,
      this.Characteristic.ChangeVolume,
      hap.Characteristic.Mute,
      this.Characteristic.CurrentTrack,
      this.Characteristic.ChangeTrack,
      this.Characteristic.SonosGroup
    ])

    // Used by homebridge-zp.
    // Note that a different UUID might be used depending on the config.json
    // setting for "service".
    this.createService('Speaker', hap.Service.Switch.UUID, [
      hap.Characteristic.On,
      hap.Characteristic.Volume,
      this.Characteristic.ChangeVolume,
      hap.Characteristic.Mute,
      this.Characteristic.Bass,
      this.Characteristic.Treble,
      this.Characteristic.Loudness
    ], [
      // this.Characteristic.Balance
    ])
  }
}

module.exports = MyHomeKitTypes
