# DozoR Web-API

**Document version: 1.33**

Description of the WEB service (Web-API) interfaces of the GTS GPS monitoring system.

---

## Introduction

This document describes the WEB service (Web-API) interfaces of the GTS GPS monitoring
system and their use for interaction and/or integration with other systems.

## Change history

| Date | Version | Description |
|------|---------|-------------|
| 2017-04-01 | 1.0 | - adopted as the base version of the document for further work; |
| 2017-04-24 | 1.1 | - the data structure of the "Trackers" interface has been changed;<br>- added description of catalog interfaces: "Objects catalog", "Companies catalog", "Company departments catalog", "Vehicle groups catalog", "Vehicles catalog";<br>- added description of "Agro" functionality interfaces: "Trailed equipment groups", "Trailed equipment", "Work groups", "Work types", "Works", "Orders"; |
| 2017-07-03 | 1.2 | - added description of "Reports" functionality interfaces: "Movement report (general)", "Movement report (detailed)"; |
| 2017-09-14 | 1.3 | - added description of "Reports" functionality interfaces: "Stops report", "Agro report (work area)"; |
| 2017-10-25 | 1.4 | - the zone data structure description of the "Zones" functionality interface has been changed; |
| 2018-08-27 | 1.5 | - the description of the data structure sent by the WEB service in response to HTTP requests for adding/modifying/deleting data has been changed;<br>- added description of "Zones" functionality interfaces: "Event settings (zone profile)", "Event settings (zone)"; |
| 2018-09-11 | 1.6 | - the description of the route schedules data structure of the "Routes" functionality interface has been changed; |
| 2018-10-01 | 1.7 | - the URL description of the "Route schedules" interface of the "Routes" functionality has been changed; |
| 2018-10-20 | 1.8 | - the description of the route schedules data structure of the "Routes" functionality interface has been changed;<br>- the description of the schedule scheme passage data structure of the "Routes" functionality interface has been changed; |
| 2018-10-30 | 1.9 | - added description of "Reports" functionality interfaces: "Zones report (entry/exit)"; |
| 2019-03-15 | 1.10 | - added description of "Agro" functionality interfaces: "Crops";<br>- the zone data structure description of the "Zones" functionality interface has been changed; |
| 2019-07-11 | 1.11 | - added description of "Agro" functionality interfaces: "Work order tasks";<br>- the object data structure description of the catalog functionality interface has been changed;<br>- the work order data structure description of the "Agro" functionality interface has been changed; |
| 2019-09-05 | 1.12 | - the URL parameter description of the "Zones report (entry/exit)" interface of the "Reports" functionality has been changed; |
| 2019-10-19 | 1.13 | - the URL parameter description of the "Agro report (work area)" interface of the "Reports" functionality has been changed; |
| 2019-12-03 | 1.14 | - the data structure description and the URL parameter description of the "Orders" interface of the "Agro" functionality have been changed;<br>- the data structure description and the URL parameter description of the "Work order tasks" interface of the "Agro" functionality have been changed; |
| 2020-04-25 | 1.15 | - the trackers data structure description has been changed; |
| 2020-07-13 | 1.16 | - added description of the general interface "Fuel data";<br>- added description of "Reports" functionality interfaces: "Fuel report (general)";<br>- the data structure description and the URL parameter description of the "Agro report (work area)" interface of the "Reports" functionality have been changed; |
| 2020-07-17 | 1.17 | - added description of catalog interfaces: "Fuel types catalog", "Gas stations/fuel tankers catalog", "Gas station/fuel tanker terminals catalog";<br>- added description of "Reports" functionality interfaces: "Fuel report – Fuel dispensing (detailed)"; |
| 2020-08-02 | 1.18 | - the URL description of the "Fuel report – Fuel dispensing (detailed)" interface of the "Reports" functionality has been changed; |
| 2020-11-13 | 1.19 | - added description of "Reports" functionality interfaces: "Agro report – Crop unloading (detailed)"; |
| 2021-02-18 | 1.20 | - added description of "Reports" functionality interfaces: "Routes report – Zone passage (on-line)"; |
| 2021-05-02 | 1.21 | - in the add/modify/delete URLs of interfaces, the optional parameter on_error_stop has been added (stop data processing after an error occurs, default true); |
| 2021-08-02 | 1.22 | - the name of the "Work order tasks" interface of the "Agro" functionality has been changed to "Work order tasks in zone (field)";<br>- the data structure description and the URL parameter description of the "Orders" interface of the "Agro" functionality have been changed;<br>- added description of "Agro" functionality interfaces: "Work order transport tasks"; |
| 2021-08-03 | 1.23 | - the data structure description and the URL parameter description of the "Orders" interface of the "Agro" functionality have been changed; |
| 2021-12-20 | 1.24 | - the structure description of the "Tracker location" interface has been changed;<br>- added description of the general interface "Tracker sensors and event settings";<br>- added description of "Reports" functionality interfaces: "Sensors report (general)", "Sensors report (states)", "Sensors report (detailed)"; |
| 2022-03-17 | 1.25 | - added description of general interfaces: "Events", "Control commands", "Control commands processing"; |
| 2022-12-30 | 1.26 | - the data structure description of the "Orders" interface of the "Agro" functionality has been changed;<br>- the data structure description and the URL parameter description of the "Agro report – Crop unloading (detailed)" interface of the "Reports" functionality have been changed; |
| 2023-03-09 | 1.27 | - the route data structure description of the "Routes" functionality interface has been changed; |
| 2023-04-30 | 1.28 | - the data structure description of the "Movement report (general)" interface of the "Reports" functionality has been changed; |
| 2023-05-31 | 1.29 | - the data structure description of the "Agro report – Crop unloading (detailed)" interface of the "Reports" functionality has been changed; |
| 2023-08-15 | 1.30 | - the structure description of the "Tracker location" interface has been changed; |
| 2023-11-15 | 1.31 | - the structure description of the "Gas stations/fuel tankers catalog" interface has been changed; |
| 2023-11-27 | 1.32 | - added description of the general interface "User device tokens"; |
| 2024-12-16 | 1.33 | - the structure description of the "Events" interfaces has been changed: "zone events"; "route checkpoint zone events"; "route events";<br>- the description of the general interface "User device tokens" has been changed;<br>- added description of "Reports" functionality interfaces: "Events report"; |

## 1. General provisions

### 1.1. Principles of interaction with the WEB service

To interact with GTS using the Web-API, you must send the corresponding HTTP
requests to the system's WEB service. In response to requests, the service returns HTTP
messages whose body contains the necessary data.
Requests to retrieve data from the system are sent using the GET method, and to modify data
in the system – using the POST method. Data for modification sent via POST must
be in the body of the request.

### 1.2. Data encoding

Data sent by the WEB service is always represented in UTF-8 encoding; accordingly,
data received by the WEB service must also be represented in UTF-8 encoding.
To optimize the interaction process, data can be sent/received in compressed
form using the gzip compression algorithm. To interact using compressed data,
HTTP requests must contain the corresponding headers.

### 1.3. Data format and structure

In the interaction process, JSON format is used for sent/received data.

#### 1.3.1. Data sent by the WEB service

In HTTP messages sent by the WEB service, the data is contained in unformatted
form – represented as a single string without line breaks.
The structure of data sent by the WEB service in response to HTTP requests for
adding/modifying/deleting data in the system and when exceptions occur has the
following general form:
```json
{
"status": "",
"error_message": "",
"uid":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | Required. Possible values: - "OK" - "INVALID_REQUEST" - "INVALID_JSON_DATA" - "SYSTEM_ERROR" |
| `error_message` | String | Required if "status" is not equal to "OK". Possible values: - contains an error message/description |
| `uid` | Array | Required for requests to add/modify/delete data in the system. Possible values: - an array of text data which are unique identifiers of successfully added/modified/deleted objects; - null |

The structure of data sent by the WEB service in response to HTTP requests to retrieve
data from the system has the form of a JSON array that always contains two elements:
[data0,data1]
| Field | Type | Description |
|-------|------|-------------|
| `data0` | Array | Required. Possible values: - an array of data in JSON format whose structure depends on the interface being called (interfaces are described in the following sections of this document) - null |
| `data1` | Array | Required, not null, if the optional parameter last_modified is specified in the HTTP request. Possible values: - an array of text data which are unique identifiers of the called interface's objects deleted in the system after last_modified - null |

#### 1.3.2. Data received by the WEB service

The structure of data in HTTP messages received by the WEB service must have the form of a
JSON array.
[data0,..,dataN]
| Field | Type | Description |
|-------|------|-------------|
| `data0,..,dataN` | JSONString | Possible values: - data in JSON format whose structure depends on the interface being called (in HTTP requests for adding/modifying data) - text data which are unique identifiers of objects in the system (in HTTP requests for deleting data) |

#### 1.3.3. Date and time format

All date and time values have a text form and are sent/received in
RFC 3339 format: "yyyy-mm-ddThh:mm:ss±hhmm". A shortened format without
the time zone is allowed: "yyyy-mm-ddThh:mm:ss".

### 1.4. User identification

Interaction with the system is performed on behalf of a specific internal system user
whose unique identifier is the Web-API key.
The Web-API key is a 32-character string consisting of Latin letters and
digits.
In all HTTP requests received by the system's WEB service, the user identifier
must be passed in the mandatory key parameter:
```http
GET /sync/devices/get?key=DCBD409558B44B1C92A74B7E48FEB02C
```

The Web-API key, like other user settings, is configured in the administrative part
of the system.

### 1.5. Object identification

To enable interaction with other systems, GTS system objects have
unique UID identifiers which, like user Web-API keys, are
32-character strings consisting of Latin letters and digits.

### 1.6. Optional interface fields and optional URL request parameters

Further in the document, in the data structures of interfaces and their URL requests, optional fields
and optional parameters will be described in gray-colored text.

## 2. General interfaces

### 2.1. Trackers

#### 2.1.1. Structure

```json
{
"uid": "",
"device_group_uid": "",
"catalog_vehicle_uid": "",
"catalog_company_uid": "",
"catalog_company_department_uid": "",
"agro_equipment_uid": "",
"name": "",
"auto_gov_number": "",
"auto_body_gov_number": "",
"auto_serial_number": "",
"auto_year": "",
"auto_color_name": "",
"auto_tech_cond": "",
"auto_repair_last_date": "",
"auto_rent": ,
"auto_fuel_norm_move": ,
"auto_rfid": "",
"connected": ,
"stop_time": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | tracker identifier |
| `device_group_uid` | String | tracker group identifier |
| `catalog_vehicle_uid` | String | vehicle identifier |
| `catalog_company_uid` | String | company identifier |
| `catalog_company_department_uid` | String | company department identifier |
| `agro_equipment_uid` | String | agro equipment identifier |
| `name` | String | name |
| `auto_gov_number` | String | vehicle state registration plate number |
| `auto_body_gov_number` | String | vehicle body state registration plate number |
| `auto_serial_number` | String | vehicle serial number |
| `auto_year` | String | vehicle year of manufacture |
| `auto_color_name` | String | vehicle color |
| `auto_tech_cond` | String | vehicle technical condition |
| `auto_repair_last_date` | String | date of the last major repair of the vehicle |
| `auto_rent` | Boolean | rented vehicle |
| `auto_fuel_norm_move` | Double | vehicle fuel consumption rate, l/km |
| `auto_rfid` | String | RFID |
| `connected` | Boolean | tracker connection with the server |
| `stop_time` | String | stop start time |
| `update_timestamp` | String | time of the last modification |

#### 2.1.2. URL

**Retrieve:**

```http
GET /sync/devices/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/devices/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/devices/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 2.2. Tracker groups

#### 2.2.1. Structure

```json
{
"uid": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | tracker group identifier |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 2.2.2. URL

**Retrieve:**

```http
GET /sync/devices/groups/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/devices/groups/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/devices/groups/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 2.3. Tracker sensors and event settings

#### 2.3.1. Structure

```json
{
"uid": "",
"device_uid": "",
"internal_number": ,
"internal_name": "",
"name": "",
"is_bool": ,
"interval_low": ,
"interval_high": ,
"interval_unit_name": "",
"name_on": "",
"name_off": "",
"event_on": ,
"event_off": ,
"event_alarm_on": ,
"event_alarm_off": ,
"event_popup_on": ,
"event_popup_off": ,
"event_priority_on": ,
"event_priority_off": ,
"hide": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | sensor identifier |
| `device_uid` | String | tracker identifier |
| `internal_number` | Integer | ordinal number; numbers <= 0 belong to system sensors; numbers > 0 belong to sensors whose data the system receives from the tracker |
| `internal_name` | String | system name |
| `name` | String | name. A modified value of this field received by the system for a sensor whose "internal_name" field value is not "stub_unused" and "rfid" will be ignored; in other cases, instead of modifying, the system will create a new sensor record with a new identifier and name, and the unmodified record will be marked as archived using the hide field |
| `is_bool` | Boolean | sensor type:<br>true – digital<br>false – analog |
| `interval_low` | Double | minimum value of the "On" state interval for an analog sensor |
| `interval_high` | Double | maximum value of the "On" state interval for an analog sensor |
| `interval_unit_name` | String | interval unit of measure |
| `name_on` | String | name of the "On" state. This field can only be modified for a sensor whose "internal_name" field value is "stub_unused" or "rfid" |
| `name_off` | String | name of the "Off" state. This field can only be modified for a sensor whose "internal_name" field value is "stub_unused" or "rfid" |
| `event_on` | Boolean | enable event generation for the "On" state |
| `event_off` | Boolean | enable event generation for the "Off" state |
| `event_alarm_on` | Boolean | "Alarm" event for the "On" state |
| `event_alarm_off` | Boolean | "Alarm" event for the "Off" state |
| `event_popup_on` | Boolean | operational events for the "On" state |
| `event_popup_off` | Boolean | operational events for the "Off" state |
| `event_priority_on` | Integer | event priority for the "On" state: -1 – low<br>0 – medium<br>1 – high |
| `event_priority_off` | Integer | event priority for the "Off" state: -1 – low<br>0 – medium<br>1 – high |
| `hide` | Boolean | archived sensor |
| `update_timestamp` | String | time of the last modification |

#### 2.3.2. URL

**Retrieve:**

```http
GET /sync/devices/sensors/get?key=..&lng=..&last_modified=..&device_uid=..
```

**Modify:**

```http
POST /sync/devices/sensors/set?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `lng` | localization ru, ua, en, default ua |
| `last_modified` | filter to retrieve data modified after the specified time |
| `device_uid` | tracker identifier |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 2.4. Tracker location

#### 2.4.1. Structure

```json
{
"device_uid": "",
"tracker_timestamp": "",
"server_timestamp": "",
"point": {},
"satellites": ,
"speed": ,
"altitude": ,
"azimuth": ,
"sensors_values": [],
"system_mode":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `tracker_timestamp` | String | tracker GPS time |
| `server_timestamp` | String | time data was received from the tracker by the server |
| `point` | GEOJSONGeometry | location coordinates in GEOJSON ESPG-4326 format |
| `satellites` | Integer | number of satellites |
| `speed` | Integer | speed, km/h |
| `altitude` | Integer | altitude above sea level, m |
| `azimuth` | Integer | azimuth (direction) 0..360, N |
| `sensors_values` | Array | sensor values as a text array. The array index + 1 corresponds to the ordinal number of the tracker sensor (assuming array indexing starts at 0) |
| `system_mode` | Integer | system state: for the "Security" protocol<br>0 – security off<br>1 – security on<br>2 – ignition on<br>5 – alarm<br>6 – maintenance mode<br>7 – panic; for the "Door Lock" protocol<br>0 – (no state)<br>5 – alarm |

#### 2.4.2. URL

**Retrieve:**

```http
GET /sync/devices/location/get?key=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |

### 2.5. Fuel data

#### 2.5.1. Structure

```json
{
"device_uid": "",
"fuel_check_time": "",
"fuel_value_start": ,
"fuel_value_in": ,
"fuel_value_out": ,
"fuel_value_end":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `fuel_check_time` | String | time of the last fuel data check by the tracker |
| `fuel_value_start` | Double | fuel volume at the start of the current day (0 for a flow-through sensor), l |
| `fuel_value_in` | Double | refueling volume for the current day (consumption for the current day for a flow-through sensor), l |
| `fuel_value_out` | Double | drained volume for the current day (0 for a flow-through sensor), l |
| `fuel_value_end` | Double | fuel volume at the time of the last fuel data check by the tracker (0 for a flow-through sensor), l |

#### 2.5.2. URL

**Retrieve:**

```http
GET /sync/devices/fuel/get?key=..&device_uid=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `device_uid` | tracker identifier |

### 2.6. Events

#### 2.6.1. Sensor events structure

```json
{
"tracker_timestamp": "",
"server_timestamp": "",
"id": ,
"device_sensor_uid": "",
"device_sensor_interval_low": ,
"device_sensor_interval_high": ,
"event_value": "",
"on": ,
"alarm": ,
"popup": ,
"priority": ,
"confirmed":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `tracker_timestamp` | String | tracker GPS time |
| `server_timestamp` | String | server time |
| `id` | Integer | event identifier |
| `device_sensor_uid` | String | tracker sensor identifier |
| `device_sensor_interval_low` | Double | minimum interval value of the analog sensor |
| `device_sensor_interval_high` | Double | maximum interval value of the analog sensor |
| `event_value` | String | sensor value |
| `on` | Boolean | "On"/"Off" state of the event |
| `alarm` | Boolean | "Alarm" event |
| `popup` | Boolean | operational event |
| `priority` | Integer | event priority: -1 – low<br>0 – medium<br>1 – high |
| `confirmed` | Boolean | confirmation of operational event handling |

#### 2.6.2. Zone events structure

```json
{
"device_uid": "",
"tracker_timestamp": "",
"server_timestamp": "",
"id": ,
"zone_uid": "",
"on": ,
"alarm": ,
"popup": ,
"confirmed":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `tracker_timestamp` | String | tracker GPS time |
| `server_timestamp` | String | server time |
| `id` | Integer | event identifier |
| `zone_uid` | String | zone identifier |
| `on` | Boolean | "On"/"Off" state of the event |
| `alarm` | Boolean | "Alarm" event |
| `popup` | Boolean | operational event |
| `confirmed` | Boolean | confirmation of operational event handling |

#### 2.6.3. Route checkpoint zone events structure

```json
{
"device_uid": "",
"tracker_timestamp": "",
"server_timestamp": "",
"id": ,
"route_zone_uid": "",
"state": ,
"alarm": ,
"popup": ,
"confirmed":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `tracker_timestamp` | String | tracker GPS time |
| `server_timestamp` | String | server time |
| `id` | Integer | event identifier |
| `route_zone_uid` | String | checkpoint zone identifier |
| `state` | Integer | event state:<br>0 – skip<br>1 – early entry<br>2 – entry<br>3 – late entry<br>4 – early exit<br>5 – exit<br>6 – late exit |
| `alarm` | Boolean | "Alarm" event |
| `popup` | Boolean | operational event |
| `confirmed` | Boolean | confirmation of operational event handling |

#### 2.6.4. Route events structure

```json
{
"device_uid": "",
"tracker_timestamp": "",
"server_timestamp": "",
"id": ,
"route_uid": "",
"route_schedule_uid": "",
"state": ,
"alarm": ,
"popup": ,
"confirmed":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `tracker_timestamp` | String | tracker GPS time |
| `server_timestamp` | String | server time |
| `id` | Integer | event identifier |
| `route_uid` | String | route identifier |
| `route_schedule_uid` | String | route schedule identifier |
| `state` | Integer | event state:<br>0 – entry on route<br>1 – exit from route |
| `alarm` | Boolean | "Alarm" event |
| `popup` | Boolean | operational event |
| `confirmed` | Boolean | confirmation of operational event handling |

#### 2.6.5. Operational events structure

```json
{
"type": ,
"event": {},
"location": {}
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | Integer | event type:<br>0 – sensor event<br>1 – zone event<br>2 – route checkpoint zone event<br>3 – route event |
| `event` | JSON | event |
| `location` | JSON | tracker location |

#### 2.6.6. URL

**Retrieve:**

```http
GET /sync/events/unconfirmed/get?key=..&time_start=..&type=..
```

**Confirm:**

```http
GET /sync/events/confirm/set?key=..&type_0_event_id=..&type_1_event_id=..&type_2_event_id=..&type_3_event_id=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve unconfirmed operational events starting from the specified time up to the current moment; in the absence of this parameter, the response will contain events created during the last 24 hours; if this parameter specifies an interval longer than 24 hours, the system forcibly shortens the interval to the last 24 hours; the response is limited to 200 event records for each type, sorted by time in descending order; |
| `type` | filter to retrieve unconfirmed operational events of a specific type<br>0 – tracker sensor events<br>1 – zone events<br>2 – route checkpoint zone events<br>3 – route events. Required types can be specified separated by commas |
| `type_0_event_id` | list of identifiers of unconfirmed operational tracker sensor events separated by commas |
| `type_1_event_id` | list of identifiers of unconfirmed operational zone events separated by commas |
| `type_2_event_id` | list of identifiers of unconfirmed operational route checkpoint zone events separated by commas |
| `type_3_event_id` | list of identifiers of unconfirmed operational route events separated by commas |

### 2.7. Control commands

#### 2.7.1. Structure

```json
{
"id": ,
"device_uid": "",
"internal_name": "",
"name": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer | command identifier |
| `device_uid` | String | tracker identifier |
| `internal_name` | String | system name |
| `name` | String | command name |

#### 2.7.2. URL

**Retrieve:**

```http
GET /sync/devices/commands/get?key=..&lng=..&device_uid=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `lng` | localization ru, ua, en, default ua |
| `device_uid` | tracker identifier |

### 2.8. Control commands processing

#### 2.8.1. Structure

```json
{
"device_command_id": ,
"server_timestamp": "",
"tracker_timestamp": "",
"state":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_command_id` | Integer | command identifier |
| `server_timestamp` | String | time the command was received by the server |
| `tracker_timestamp` | String | time of command processing state change by the system's track server |
| `state` | Integer | processing state:<br>0 – in queue; 1, 2 – processing<br>3 – completed; 4, 5 – error |

#### 2.8.2. URL

**Retrieve:**

```http
GET /sync/devices/commands/processing/get?key=..&device_uid=..
```

**Add:**

```http
GET /sync/devices/commands/processing/set?key=..&device_command_id=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `device_uid` | tracker identifier |
| `device_command_id` | command identifier |

### 2.9. User device tokens

#### 2.9.1. URL

**Add:**

```http
GET /sync/users/token/set?key=..&token=..&lng=..
```

**Delete:**

```http
GET /sync/users/token/del?key=..&token=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `token` | device token |
| `lng` | user language |

## 3. Catalog interfaces

### 3.1. Drivers catalog

#### 3.1.1. Structure

```json
{
"uid": "",
"fio": "",
"rfid": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | driver identifier |
| `fio` | String | full name |
| `rfid` | String | RFID |
| `update_timestamp` | String | time of the last modification |

#### 3.1.2. URL

**Retrieve:**

```http
GET /sync/catalog/drivers/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/catalog/drivers/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/catalog/drivers/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 3.2. Objects catalog (monitored objects, executors, clients)

#### 3.2.1. Structure

```json
{
"uid": "",
"type": ,
"name": "",
"info": "",
"data": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | object identifier |
| `type` | Integer | object type:<br>0 – executor<br>1 – monitored object<br>2 – client |
| `name` | String | name |
| `info` | String | additional information |
| `data` | JSON | object data in arbitrary JSON structure format |
| `update_timestamp` | String | time of the last modification |

#### 3.2.2. URL

**Retrieve:**

```http
GET /sync/catalog/objects/get?key=..&last_modified=..&type..
```

**Add/modify:**

```http
POST /sync/catalog/objects/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/catalog/objects/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `type` | filter to retrieve only objects of the specified type |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 3.3. Companies catalog

#### 3.3.1. Structure

```json
{
"uid": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | company identifier |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 3.3.2. URL

**Retrieve:**

```http
GET /sync/catalog/companies/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/catalog/companies/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/catalog/companies/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 3.4. Company departments catalog

#### 3.4.1. Structure

```json
{
"uid": "",
"catalog_company_uid": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | department identifier |
| `catalog_company_uid` | String | company identifier |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 3.4.2. URL

**Retrieve:**

```http
GET /sync/catalog/companies/departments/get?key=..&last_modified=..&catalog_company_uid=..
```

**Add/modify:**

```http
POST /sync/catalog/companies/departments/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/catalog/companies/departments/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `catalog_company_uid` | filter to retrieve departments only of the specified company |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 3.5. Vehicle groups catalog

#### 3.5.1. Structure

```json
{
"uid": "",
"catalog_vehicle_group_uid": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | group identifier |
| `catalog_vehicle_group_uid` | String | identifier of the group to which this group belongs |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 3.5.2. URL

**Retrieve:**

```http
GET /sync/catalog/vehicles/groups/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/catalog/vehicles/groups/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/catalog/vehicles/groups/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 3.6. Vehicles catalog

#### 3.6.1. Structure

```json
{
"uid": "",
"catalog_vehicle_group_uid": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | vehicle identifier |
| `catalog_vehicle_group_uid` | String | vehicle group identifier |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 3.6.2. URL

**Retrieve:**

```http
GET /sync/catalog/vehicles/get?key=..&last_modified=..&catalog_vehicle_group_uid=..
```

**Add/modify:**

```http
POST /sync/catalog/vehicles/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/catalog/vehicles/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `catalog_vehicle_group_uid` | filter to retrieve vehicles only of the specified group |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 3.7. Fuel types catalog

#### 3.7.1. Structure

```json
{
"uid": "",
"number": ,
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | fuel type identifier |
| `number` | Integer | number |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 3.7.2. URL

**Retrieve:**

```http
GET /sync/catalog/fuel/types/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/catalog/fuel/types/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/catalog/fuel/types/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 3.8. Gas stations/fuel tankers catalog

#### 3.8.1. Structure

```json
{
"uid": "",
"device_uid": "",
"name": "",
"location": {},
"azs_id": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `Uid` | String | gas station/fuel tanker identifier |
| `device_uid` | String | tracker identifier |
| `Name` | String | name |
| `location` | GEOJSONGeometry | gas station location in GEOJSON ESPG-4326 format |
| `azs_id` | Integer | external system gas station ID |
| `update_timestamp` | String | time of the last modification |

#### 3.8.2. URL

**Retrieve:**

```http
GET /sync/catalog/fuel/stations/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/catalog/fuel/stations/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/catalog/fuel/stations/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 3.9. Gas station/fuel tanker terminals catalog

#### 3.9.1. Structure

```json
{
"uid": "",
"catalog_fuel_station_uid": "",
"serial_number": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | gas station/fuel tanker terminal identifier |
| `catalog_fuel_station_uid` | String | gas station/fuel tanker identifier |
| `serial_number` | String | serial number |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 3.9.2. URL

**Retrieve:**

```http
GET /sync/catalog/fuel/terminals/get?key=..&last_modified=..&catalog_fuel_station_uid=..
```

**Add/modify:**

```http
POST /sync/catalog/fuel/terminals/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/catalog/fuel/terminals/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `catalog_fuel_station_uid` | filter to retrieve terminals only of the specified gas station/fuel tanker |
| `on_error_stop` | stop data processing after an error occurs, default true |

## 4. "Zones" functionality interfaces

### 4.1. Zone profiles

#### 4.1.1. Structure

```json
{
"uid": "",
"name": "",
"type": ,
"info": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | zone profile identifier |
| `name` | String | name |
| `type` | Integer | profile type:<br>0 – general<br>1 – security<br>2 – agro |
| `info` | String | additional information |
| `update_timestamp` | String | time of the last modification |

#### 4.1.2. URL

**Retrieve:**

```http
GET /sync/zones/profiles/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/zones/profiles/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/zones/profiles/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 4.2. Zones

#### 4.2.1. Structure

```json
{
"uid": "",
"zone_profile_uid": "",
"name": "",
"kind": ,
"geom": {},
"radius": ,
"area": ,
"outline_color": "",
"fill_color": "",
"info": "",
"type": ,
"agro_crop_uid": "",
"agro_crop_prev_uid": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | zone identifier |
| `zone_profile_uid` | String | zone profile identifier |
| `name` | String | name |
| `kind` | Integer | zone geometry type:<br>0 – circle<br>1 – polygon<br>2 – multipolygon |
| `geom` | GEOJSONGeometry | zone geometry in GEOJSON ESPG-4326 format |
| `radius` | Double | radius for the "circle" zone type, m; perimeter for the "polygon" zone type, m |
| `area` | Double | area, m |
| `outline_color` | String | outline color, "r,g,b,a" |
| `fill_color` | String | fill color, "r,g,b,a" |
| `info` | String | additional information |
| `type` | Integer | zone type:<br>0 – type not specified<br>1 – prohibited<br>2 – field<br>3 – production |
| `agro_crop_uid` | String | crop identifier for a "field" type zone |
| `agro_crop_prev_uid` | String | crop identifier (predecessor) for a "field" type zone |
| `update_timestamp` | String | time of the last modification |

#### 4.2.2. URL

**Retrieve:**

```http
GET /sync/zones/get?key=..&last_modified=..&zone_profile_uid=..
```

**Add/modify:**

```http
POST /sync/zones/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/zones/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `zone_profile_uid` | filter to retrieve zones only for the specified zone profile |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 4.3. Event settings (zone profile)

#### 4.3.1. Structure

```json
{
"uid": "",
"zone_profile_uid": "",
"device_uid": "",
"enter_on": ,
"exit_on": ,
"enter_alarm": ,
"exit_alarm": ,
"enter_popup": ,
"exit_popup": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | settings record identifier |
| `zone_profile_uid` | String | zone profile identifier |
| `device_uid` | String | tracker identifier |
| `enter_on` | Boolean | entry events |
| `exit_on` | Boolean | exit events |
| `enter_alarm` | Boolean | mark entry events with "alarm" status |
| `exit_alarm` | Boolean | mark exit events with "alarm" status |
| `enter_popup` | Boolean | mark entry events as "operational" |
| `exit_popup` | Boolean | mark exit events as "operational" |
| `update_timestamp` | String | time of the last modification |

#### 4.3.2. URL

**Retrieve:**

```http
GET /sync/zones/profiles/devices/get?key=..&last_modified=..&zone_profile_uid=..&device_uid=..
```

**Add/modify:**

```http
POST /sync/zones/profiles/devices/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/zones/profiles/devices/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `zone_profile_uid` | filter to retrieve event settings only for the specified zone profile |
| `device_uid` | filter to retrieve event settings only for the specified tracker |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 4.4. Event settings (zone)

#### 4.4.1. Structure

```json
{
"uid": "",
"zone_uid": "",
"device_uid": "",
"enter_on": ,
"exit_on": ,
"enter_alarm": ,
"exit_alarm": ,
"enter_popup": ,
"exit_popup": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | settings record identifier |
| `zone_uid` | String | zone identifier |
| `device_uid` | String | tracker identifier |
| `enter_on` | Boolean | entry events |
| `exit_on` | Boolean | exit events |
| `enter_alarm` | Boolean | mark entry events with "alarm" status |
| `exit_alarm` | Boolean | mark exit events with "alarm" status |
| `enter_popup` | Boolean | mark entry events as "operational" |
| `exit_popup` | Boolean | mark exit events as "operational" |
| `update_timestamp` | String | time of the last modification |

#### 4.4.2. URL

**Retrieve:**

```http
GET /sync/zones/devices/get?key=..&last_modified=..&zone_profile_uid=..&zone_uid=..&device_uid=..
```

**Add/modify:**

```http
POST /sync/zones/devices/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/zones/devices/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `zone_profile_uid` | filter to retrieve event settings only for the specified zone profile |
| `zone_uid` | filter to retrieve event settings only for the specified zone |
| `device_uid` | filter to retrieve event settings only for the specified tracker |
| `on_error_stop` | stop data processing after an error occurs, default true |

## 5. "Routes" functionality interfaces

### 5.1. Routes

#### 5.1.1. Structure

```json
{
"uid": "",
"name": [],
"short_name": "",
"outline_color": "",
"fill_color": "",
"price": ,
"count_devices_plan": ,
"count_devices_plan_of_day": ,
"count_devices_plan_of_holiday": ,
"count_flights_plan": ,
"count_flights_plan_of_day": ,
"count_flights_plan_of_holiday": ,
"event_come": ,
"event_come_popup": ,
"event_come_alarm": ,
"event_leav": ,
"event_leav_popup": ,
"event_leav_alarm": ,
"info": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | route identifier |
| `name` | Array | text array of names for various localizations, ["ru","ua","en"] |
| `short_name` | String | short name |
| `outline_color` | String | outline color, "r,g,b,a" |
| `fill_color` | String | fill color, "r,g,b,a" |
| `price` | Double | fare |
| `count_devices_plan` | Integer | fixed number of trackers on the route |
| `count_devices_plan_of_day` | Integer | fixed number of trackers per day |
| `count_devices_plan_of_holiday` | Integer | fixed number of trackers per day (holiday) |
| `count_flights_plan` | Integer | fixed number of flights on the route |
| `count_flights_plan_of_day` | Integer | fixed number of flights per day |
| `count_flights_plan_of_holiday` | Integer | fixed number of flights per day (holiday) |
| `event_come` | Boolean | enable generation of events when a tracker enters the route |
| `event_come_popup` | Boolean | mark entry events as "operational" |
| `event_come_alarm` | Boolean | mark entry events with "alarm" status |
| `event_leav` | Boolean | enable generation of events when a tracker exits the route |
| `event_leav_popup` | Boolean | mark exit events as "operational" |
| `event_leav_alarm` | Boolean | mark exit events with "alarm" status |
| `info` | String | additional information |
| `update_timestamp` | String | time of the last modification |

#### 5.1.2. URL

**Retrieve:**

```http
GET /sync/routes/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/routes/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/routes/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 5.2. Route checkpoint zones

#### 5.2.1. Structure

```json
{
"uid": "",
"route_uid": "",
"internal_number": ,
"type": ,
"geom": {},
"radius": ,
"center": {},
"name": [],
"info": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | checkpoint zone identifier |
| `route_uid` | String | route identifier |
| `internal_number` | Integer | ordinal number of the zone in the route |
| `type` | Integer | zone type:<br>0 – circle<br>1 – polygon |
| `geom` | GEOJSONGeometry | zone geometry in GEOJSON ESPG-4326 format |
| `radius` | Double | radius for the "circle" zone type, m; perimeter for the "polygon" zone type, m |
| `center` | GEOJSONGeometry | zone center in GEOJSON ESPG-4326 format |
| `name` | Array | text array of names for various localizations, ["ru","ua","en"] |
| `info` | String | additional information |
| `update_timestamp` | String | time of the last modification |

#### 5.2.2. URL

**Retrieve:**

```http
GET /sync/routes/zones/get?key=..&last_modified=..&route_uid=..
```

**Add/modify:**

```http
POST /sync/routes/zones/set?key=..&on_error_stop=..&clone=..
```

**Delete:**

```http
POST /sync/routes/zones/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `route_uid` | filter to retrieve zones only for the specified route |
| `on_error_stop` | stop data processing after an error occurs, default true |
| `clone` |  |

### 5.3. Lines connecting route checkpoint zones

#### 5.3.1. Structure

```json
{
"uid": "",
"route_uid": "",
"route_zone_uid_start": "",
"route_zone_uid_end": "",
"points": [],
"distance": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | line identifier |
| `route_uid` | String | route identifier |
| `route_zone_uid_start` | String | start zone identifier |
| `route_zone_uid_end` | String | end zone identifier |
| `points` | Array | array of points between the start and end zone in GEOJSON ESPG-4326 format |
| `distance` | Double | line distance, m |
| `update_timestamp` | String | time of the last modification |

#### 5.3.2. URL

**Retrieve:**

```http
GET /sync/routes/lines/get?key=..&last_modified=..&route_uid=..
```

**Add/modify:**

```http
POST /sync/routes/lines/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/routes/lines/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `route_uid` | filter to retrieve lines only for the specified route |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 5.4. Route schedules

#### 5.4.1. Structure

```json
{
"uid": "",
"route_uid": "",
"name": "",
"type": ,
"deviation_interval_left": ,
"deviation_interval_right": ,
"count_zones": ,
"count_flights": ,
"distance": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | schedule identifier |
| `route_uid` | String | route identifier |
| `name` | String | name |
| `type` | Integer | schedule type:<br>0 – daily<br>1 – weekly<br>2 – monthly<br>3 – general<br>4 – free |
| `deviation_interval_left` | Integer | allowable early deviation when executing schedule flights, sec |
| `deviation_interval_right` | Integer | allowable late deviation when executing schedule flights, sec |
| `count_zones` | Integer | number of zones in the schedule scheme |
| `count_flights` | Integer | number of flights in the schedule |
| `distance` | Double | line distance, m |
| `update_timestamp` | String | time of the last modification |

#### 5.4.2. URL

**Retrieve:**

```http
GET /sync/routes/schedules/get?key=..&last_modified=..&route_uid=..&route_zone_name_start=..&route_zone_name_end=..
```

**Add/modify:**

```http
POST /sync/routes/schedules/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/routes/schedules/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `route_uid` | filter to retrieve schedules only for the specified route |
| `route_zone_name_start` | filter to retrieve schedules by the name of the first zone in the scheme |
| `route_zone_name_end` | filter to retrieve schedules by the name of the additional zone in the scheme |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 5.5. Schedule flights

#### 5.5.1. Structure

```json
{
"uid": "",
"route_schedule_uid": "",
"departure_day_number": ,
"departure_day_time": ,
"departure_time": "",
"arrival_day_number": ,
"arrival_day_time": ,
"arrival_time": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | flight identifier |
| `route_schedule_uid` | String | schedule identifier |
| `departure_day_number` | Integer | departure day number; for a "weekly" type schedule: day-of-week number [0..7], 0-Sunday; for a "monthly" type schedule: day of month |
| `departure_day_time` | Integer | departure time of day; for schedules of "daily", "weekly", "monthly" types: time of day in seconds from the start of the day |
| `departure_time` | String | departure time for a "general" type schedule |
| `arrival_day_number` | Integer | arrival day number; for a "weekly" type schedule: day-of-week number [0..7], 0-Sunday; for a "monthly" type schedule: day of month |
| `arrival_day_time` | Integer | arrival time of day; for schedules of "daily", "weekly", "monthly" types: time of day in seconds from the start of the day |
| `arrival_time` | String | arrival time for a "general" type schedule |
| `update_timestamp` | String | time of the last modification |

#### 5.5.2. URL

**Retrieve:**

```http
GET /sync/routes/schedules/flights/get?key=..&last_modified=..&route_uid=..&route_schedule_uid=..
```

**Add/modify:**

```http
POST /sync/routes/schedules/flights/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/routes/schedules/flights/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `route_uid` | filter to retrieve schedule flights only for the specified route |
| `route_schedule_uid` | filter to retrieve flights only for the specified schedule |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 5.6. Schedule schemes (zone-based schedule schemes)

#### 5.6.1. Structure

```json
{
"uid": "",
"route_schedule_uid": "",
"route_zone_uid": "",
"internal_number": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | schedule scheme identifier |
| `route_schedule_uid` | String | schedule identifier |
| `route_zone_uid` | String | route checkpoint zone identifier |
| `internal_number` | Integer | ordinal number of the zone in the schedule scheme |
| `update_timestamp` | String | time of the last modification |

#### 5.6.2. URL

**Retrieve:**

```http
GET /sync/routes/schedules/scheme/get?key=..&last_modified=..&route_uid=..&route_schedule_uid=..
```

**Add/modify:**

```http
POST /sync/routes/schedules/scheme/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/routes/schedules/scheme/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `route_uid` | filter to retrieve schedule schemes only for the specified route |
| `route_schedule_uid` | filter to retrieve schemes only for the specified schedule |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 5.7. Schedule scheme passage

#### 5.7.1. Structure

```json
{
"uid": "",
"route_schedule_uid": "",
"route_zone_uid": "",
"arrival_day_number": ,
"arrival_day_time": ,
"arrival_time": "",
"departure_day_number": ,
"departure_day_time": ,
"departure_time": ,
"events": [],
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | schedule scheme identifier |
| `route_schedule_uid` | String | schedule identifier |
| `route_zone_uid` | String | route checkpoint zone identifier |
| `arrival_day_number` | Integer | arrival day number; for a "weekly" type schedule: day-of-week number [0..7], 0-Sunday; for a "monthly" type schedule: day of month |
| `arrival_day_time` | Integer | arrival time; for schedules of "daily", "weekly", "monthly" types: time of day in seconds from the start of the day; for "free" type schedules: elapsed time in seconds from the start of movement on the schedule |
| `arrival_time` | String | arrival time for a "general" type schedule |
| `departure_day_number` | Integer | departure day number; for a "weekly" type schedule: day-of-week number [0..7], 0-Sunday; for a "monthly" type schedule: day of month |
| `departure_day_time` | Integer | departure time; for schedules of "daily", "weekly", "monthly" types: time of day in seconds from the start of the day; for "free" type schedules: elapsed time in seconds from the start of movement on the schedule |
| `departure_time` | String | departure time for a "general" type schedule |
| `events` | Array | array of size 19 with Boolean values for configuring events of route checkpoint zone passage:<br>0 – entry "operational"<br>1 – entry "alarm"<br>2 – late entry<br>3 – late entry "operational"<br>4 – late entry "alarm"<br>5 – early entry<br>6 – early entry "operational"<br>7 – early entry "alarm"<br>8 – exit "operational"<br>9 – exit "alarm"<br>10 – late exit<br>11 – late exit "operational"<br>12 – late exit "alarm"<br>13 – early exit<br>14 – early exit "operational"<br>15 – early exit "alarm"<br>16 – skip<br>17 – skip "operational"<br>18 – skip "alarm" |
| `update_timestamp` | String | time of the last modification |

#### 5.7.2. URL

**Retrieve:**

```http
GET /sync/routes/schedules/plan/get?key=..&last_modified=..&route_uid=..&route_schedule_uid=..
```

**Add/modify:**

```http
POST /sync/routes/schedules/plan/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/routes/schedules/plan/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `route_uid` | filter to retrieve schedule scheme passage only for the specified route |
| `route_schedule_uid` | filter to retrieve scheme passage only for the specified schedule |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 5.8. Schedule execution by trackers (schedule execution orders)

#### 5.8.1. Structure

```json
{
"uid": "",
"route_schedule_uid": "",
"device_uid": "",
"device_group_uid": "",
"monitor_object_uid": "",
"executor_object_uid": "",
"add_time": "",
"remove_time": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | schedule execution identifier |
| `route_schedule_uid` | String | schedule identifier |
| `device_uid` | String | tracker identifier |
| `device_group_uid` | String | tracker group identifier |
| `monitor_object_uid` | String | monitored object identifier |
| `executor_object_uid` | String | executor identifier |
| `add_time` | String | execution start time |
| `remove_time` | String | execution end time |
| `update_timestamp` | String | time of the last modification |

#### 5.8.2. URL

**Retrieve:**

```http
GET /sync/routes/schedules/devices/get?key=..&last_modified=..&route_uid=..&date=..
```

**Add/modify:**

```http
POST /sync/routes/schedules/devices/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/routes/schedules/devices/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `route_uid` | filter to retrieve schedule executions only for the specified route |
| `date` | filter to retrieve schedule executions only for the specified date |
| `on_error_stop` | stop data processing after an error occurs, default true |

## 6. "Agro" functionality interfaces

### 6.1. Trailed equipment groups (agro equipment)

#### 6.1.1. Structure

```json
{
"uid": "",
"agro_equipment_group_uid": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | group identifier |
| `agro_equipment_group_uid` | String | identifier of the group to which this group belongs |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 6.1.2. URL

**Retrieve:**

```http
GET /sync/agro/equipment/groups/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/agro/equipment/groups/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/agro/equipment/groups/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 6.2. Trailed equipment (agro equipment)

#### 6.2.1. Structure

```json
{
"uid": "",
"agro_equipment_group_uid": "",
"name": "",
"width_work": ,
"serial_number": "",
"rfid": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | equipment identifier |
| `agro_equipment_group_uid` | String | group identifier |
| `name` | String | name |
| `width_work` | Double | working width, m |
| `serial_number` | String | serial number |
| `rfid` | String | RFID |
| `update_timestamp` | String | time of the last modification |

#### 6.2.2. URL

**Retrieve:**

```http
GET /sync/agro/equipment/get?key=..&last_modified=..&agro_equipment_group_uid=..
```

**Add/modify:**

```http
POST /sync/agro/equipment/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/agro/equipment/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `agro_equipment_group_uid` | filter to retrieve equipment only of the specified group |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 6.3. Crops

#### 6.3.1. Structure

```json
{
"uid": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | crop identifier |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 6.3.2. URL

**Retrieve:**

```http
GET /sync/agro/crops/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/agro/crops/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/agro/crops/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 6.4. Work groups

#### 6.4.1. Structure

```json
{
"uid": "",
"agro_work_group_uid": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | group identifier |
| `agro_work_group_uid` | String | identifier of the group to which this group belongs |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 6.4.2. URL

**Retrieve:**

```http
GET /sync/agro/works/groups/get?key=..&last_modified=..
```

**Add/modify:**

```http
POST /sync/agro/works/groups/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/agro/works/groups/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 6.5. Work types

#### 6.5.1. Structure

```json
{
"uid": "",
"agro_work_group_uid": "",
"name": "",
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | work type identifier |
| `agro_work_group_uid` | String | group identifier |
| `name` | String | name |
| `update_timestamp` | String | time of the last modification |

#### 6.5.2. URL

**Retrieve:**

```http
GET /sync/agro/works/types/get?key=..&last_modified=..&agro_work_group_uid=..
```

**Add/modify:**

```http
POST /sync/agro/works/types/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/agro/works/types/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `agro_work_group_uid` | filter to retrieve work types only of the specified group |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 6.6. Works

#### 6.6.1. Structure

```json
{
"uid": "",
"device_uid": "",
"agro_equipment_uid": "",
"agro_work_type_uid": "",
"width_work": ,
"fuel_norm_move_0": ,
"fuel_norm_move_1": ,
"fuel_norm_move_unit_0": ,
"fuel_norm_move_unit_1": ,
"fuel_norm_work_unit_0": ,
"fuel_norm_work_unit_1": ,
"fuel_norm_work_area": ,
"speed_norm_move": ,
"speed_norm_move_work": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | work identifier |
| `device_uid` | String | tracker identifier |
| `agro_equipment_uid` | String | trailed equipment identifier |
| `agro_work_type_uid` | String | work type identifier |
| `width_work` | Double | working width, m |
| `fuel_norm_move_0` | Double | fuel consumption rate during movement, l/100km |
| `fuel_norm_move_1` | Double | fuel consumption rate during movement, l/m.h |
| `fuel_norm_move_unit_0` | Double | fuel consumption rate of the unit (movement), l/100km |
| `fuel_norm_move_unit_1` | Double | fuel consumption rate of the unit (movement), l/m.h |
| `fuel_norm_work_unit_0` | Double | fuel consumption rate of the unit (work), l/100km |
| `fuel_norm_work_unit_1` | Double | fuel consumption rate of the unit (work), l/m.h |
| `fuel_norm_work_area` | Double | fuel consumption rate of the unit (work), l/ha |
| `speed_norm_move` | Double | speed rate (movement), km/h |
| `speed_norm_move_work` | Double | speed rate (work), km/h |
| `update_timestamp` | String | time of the last modification |

#### 6.6.2. URL

**Retrieve:**

```http
GET /sync/agro/works/get?key=..&last_modified=..&agro_work_type_uid=..&agro_work_group_uid=..
```

**Add/modify:**

```http
POST /sync/agro/works/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/agro/works/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `agro_work_type_uid` | filter to retrieve works only of the specified work type |
| `agro_work_group_uid` | filter to retrieve works only of the specified group |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 6.7. Orders

#### 6.7.1. Structure

```json
{
"uid": "",
"uname": "",
"add_time": "",
"start_time": "",
"end_time": "",
"client_object_uid": "",
"device_uid": "",
"catalog_driver_uid_0": "",
"catalog_driver_uid_1": "",
"agro_equipment_uid": "",
"width_work": ,
"agro_work_type_uid": "",
"fuel_norm_move_0": ,
"fuel_norm_move_1": ,
"fuel_norm_move_unit_0": ,
"fuel_norm_move_unit_1": ,
"fuel_norm_work_unit_0": ,
"fuel_norm_work_unit_1": ,
"fuel_norm_work_area": ,
"speed_norm_move": ,
"speed_norm_move_work": ,
"responsible": "",
"mon_control": ,
"mon_control_stop": ,
"mon_control_stop_value": ,
"mon_control_stop_alarm": ,
"mon_control_stop_popup": ,
"mon_control_stop_priority": ,
"mon_control_speed": ,
"mon_control_speed_value": ,
"mon_control_speed_alarm": ,
"mon_control_speed_popup": ,
"mon_control_speed_priority": ,
"mon_control_error_gps": ,
"mon_control_error_gps_value": ,
"mon_control_error_gps_alarm": ,
"mon_control_error_gps_popup": ,
"mon_control_error_gps_priority": ,
"mon_control_coonect": ,
"mon_control_connect_value": ,
"mon_control_connect_alarm": ,
"mon_control_connect_popup": ,
"mon_control_connect_priority": ,
"numb_works": ,
"numb_closed_works": ,
"numb_works_trans": ,
"update_timestamp": "",
"works": [],
"works_trans": []
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | order identifier |
| `uname` | String | order identifier name |
| `add_time` | String | time the order was added to the system |
| `start_time` | String | start time (start of work on the order) |
| `end_time` | String | end time (end of work on the order) |
| `client_object_uid` | String | client identifier |
| `device_uid` | String | tracker identifier |
| `catalog_driver_uid_0` | String | driver identifier |
| `catalog_driver_uid_1` | String | driver identifier |
| `agro_equipment_uid` | String | trailed equipment identifier |
| `width_work` | Double | working width, m |
| `agro_work_type_uid` | String | work type identifier |
| `fuel_norm_move_0` | Double | fuel consumption rate during movement, l/100km |
| `fuel_norm_move_1` | Double | fuel consumption rate during movement, l/m.h |
| `fuel_norm_move_unit_0` | Double | fuel consumption rate of the unit (movement), l/100km |
| `fuel_norm_move_unit_1` | Double | fuel consumption rate of the unit (movement), l/m.h |
| `fuel_norm_work_unit_0` | Double | fuel consumption rate of the unit (work), l/100km |
| `fuel_norm_work_unit_1` | Double | fuel consumption rate of the unit (work), l/m.h |
| `fuel_norm_work_area` | Double | fuel consumption rate of the unit (work), l/ha |
| `speed_norm_move` | Double | speed rate (movement), km/h |
| `speed_norm_move_work` | Double | speed rate (work), km/h |
| `responsible` | String | responsible person |
| `mon_control` | Boolean | tracker monitoring (used in client software for automatic activation of tracker monitoring mode) |
| `mon_control_stop` | Boolean | enable event state (off) of the "Stop control" sensor of the tracker for the duration of the order execution |
| `mon_control_stop_value` | Double | max interval value of the "Stop control" sensor |
| `mon_control_stop_alarm` | Boolean | alarm event of the "Stop control" sensor |
| `mon_control_stop_popup` | Boolean | operational event of the "Stop control" sensor |
| `mon_control_stop_priority` | Integer | event priority of the "Stop control" sensor: -1 – low<br>0 – medium<br>1 – high |
| `mon_control_speed` | Boolean | enable event state (off) of the "Speed control" sensor of the tracker for the duration of the order execution |
| `mon_control_speed_value` | Double | max interval value of the "Speed control" sensor |
| `mon_control_speed_alarm` | Boolean | alarm event of the "Speed control" sensor |
| `mon_control_speed_popup` | Boolean | operational event of the "Speed control" sensor |
| `mon_control_speed_priority` | Integer | event priority of the "Speed control" sensor: -1 – low<br>0 – medium<br>1 – high |
| `mon_control_error_gps` | Boolean | enable event state (off) of the "Incorrect GPS data" sensor of the tracker for the duration of the order execution |
| `mon_control_error_gps_value` | Double | max interval value of the "Incorrect GPS data" sensor |
| `mon_control_error_gps_alarm` | Boolean | alarm event of the "Incorrect GPS data" sensor |
| `mon_control_error_gps_popup` | Boolean | operational event of the "Incorrect GPS data" sensor |
| `mon_control_error_gps_priority` | Integer | event priority of the "Incorrect GPS data" sensor: -1 – low<br>0 – medium<br>1 – high |
| `mon_control_connect` | Boolean | enable event state (off) of the "Tracker connection" sensor of the tracker for the duration of the order execution |
| `mon_control_connect_value` | Double | max interval value of the "Tracker connection" sensor |
| `mon_control_connect_alarm` | Boolean | alarm event of the "Tracker connection" sensor |
| `mon_control_connect_popup` | Boolean | operational event of the "Tracker connection" sensor |
| `mon_control_connect_priority` | Integer | event priority of the "Tracker connection" sensor: -1 – low<br>0 – medium<br>1 – high |
| `numb_works` | Integer | number of order tasks in zone (field) |
| `numb_closed_works` | Integer | number of closed order tasks in zone (field) |
| `numb_works_trans` | Integer | number of order transport tasks |
| `update_timestamp` | String | time of the last modification |
| `works` | Array | order tasks in zone (field) |
| `works_trans` | Array | order transport tasks |

#### 6.7.2. URL

**Retrieve:**

```http
GET /sync/agro/orders/get?key=..&last_modified=..&time_start=..&time_end=..&works_closed=..&works=..&works_trans=..
```

**Add/modify:**

```http
POST /sync/agro/orders/set?key=..&replace=..&on_error_stop=..GET /sync/agro/orders/end_time/set?key=..&uid=..&end_time=..
```

**Delete:**

```http
POST /sync/agro/orders/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `uid` | order identifier |
| `end_time` | end time (end of work on the order) |
| `last_modified` | filter to retrieve data modified after the specified time |
| `time_start` | filter to retrieve orders for the specified period |
| `time_end` | filter to retrieve orders for the specified period |
| `works_closed` | filter to retrieve orders with closed (true) or not closed (false) tasks in zone (field) |
| `works` | retrieve orders together with tasks in zone (field) |
| `works_trans` | retrieve orders together with transport tasks |
| `replace` | adding an order with replacement (deletion) of orders matching by tracker, work type, and matching/overlapping by the start time and end time of the order |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 6.8. Order tasks in zone (field)

#### 6.8.1. Structure

```json
{
"uid": "",
"agro_order_uid": "",
"zone_uid": "",
"agro_crop_uid": "",
"year_crop": ,
"work_repeated": ,
"work_new": ,
"work_closed": ,
"close_area_specified": ,
"update_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | order task identifier |
| `agro_order_uid` | String | order identifier |
| `zone_uid` | String | zone (field) identifier |
| `agro_crop_uid` | String | crop identifier |
| `year_crop` | Integer | crop year |
| `work_repeated` | Boolean | repeated work |
| `work_new` | Boolean | new work |
| `work_closed` | Boolean | work closed |
| `close_area_specified` | Double | refined area of closed work |
| `update_timestamp` | String | time of the last modification |

#### 6.8.2. URL

**Retrieve:**

```http
GET /sync/agro/orders/works/get?key=..&last_modified=..&agro_order_uid=..&time_start=..&time_end=..&works_closed=..
```

**Add/modify:**

```http
POST /sync/agro/orders/works/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/agro/orders/works/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `agro_order_uid` | filter to retrieve tasks of the specified order |
| `time_start` | filter to retrieve order tasks for the specified period |
| `time_end` | filter to retrieve order tasks for the specified period |
| `works_closed` | filter to retrieve closed (true) or not closed (false) order tasks |
| `on_error_stop` | stop data processing after an error occurs, default true |

### 6.9. Order transport tasks

#### 6.9.1. Structure

```json
{
"uid": "",
"agro_order_uid": "",
"agro_crop_uid": "",
"download_place": "",
"download_time": "",
"upload_place": "",
"upload_time": "",
"value_weight":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | order task identifier |
| `agro_order_uid` | String | order identifier |
| `agro_crop_uid` | String | crop identifier |
| `download_place` | String | loading place |
| `download_time` | String | loading time |
| `upload_place` | String | unloading place |
| `upload_time` | String | unloading time |
| `value_weight` | String | weight, kg |

#### 6.9.2. URL

**Retrieve:**

```http
GET /sync/agro/orders/works/trans/get?key=..&last_modified=..&agro_order_uid=..&time_start=..&time_end=..
```

**Add/modify:**

```http
POST /sync/agro/orders/works/trans/set?key=..&on_error_stop=..
```

**Delete:**

```http
POST /sync/agro/orders/works/trans/del?key=..&on_error_stop=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `last_modified` | filter to retrieve data modified after the specified time |
| `agro_order_uid` | filter to retrieve tasks of the specified order |
| `time_start` | filter to retrieve order tasks for the specified period |
| `time_end` | filter to retrieve order tasks for the specified period |
| `on_error_stop` | stop data processing after an error occurs, default true |

## 7. "Reports" functionality interfaces

### 7.1. Movement report (general)

#### 7.1.1. Structure

```json
{
"device_uid": "",
"s": ,
"time": ,
"time_move": ,
"move_start_timestamp": "",
"move_end_timestamp": "",
"time_stop": ,
"time_moto": ,
"time_moto_stop": ,
"speed_avg": ,
"speed_max":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `s` | Double | distance traveled, m |
| `time` | Integer | total time, s |
| `time_move` | Integer | time in motion, s |
| `move_start_timestamp` | String | time of the start of the first movement |
| `move_end_timestamp` | String | time of the end of the last movement |
| `time_stop` | Integer | stops time, s |
| `time_moto` | Integer | engine running time, s |
| `time_moto_stop` | Integer | idle time, s |
| `speed_avg` | Integer | average speed, km/h |
| `speed_max` | Integer | maximum speed, km/h |

#### 7.1.2. URL

```http
GET /sync/reports/2/get?key=..&time_start=..&time_end=..&device_uid=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report only for the specified trackers |

### 7.2. Movement report (detailed)

#### 7.2.1. Structure

```json
{
"s": ,
"time_stop": ,
"location": {
"device_uid": "",
"tracker_timestamp": "",
"server_timestamp": "",
"point": {},
"satellites": ,
"speed": ,
"altitude": ,
"azimuth": ,
"sensors_values": []
}
}
```

| Field | Type | Description |
|-------|------|-------------|
| `s` | Double | distance traveled, m |
| `time_stop` | Integer | stop time, s |
| `location` | JSON | location (see tracker location) |

#### 7.2.2. URL

```http
GET /sync/reports/1/get?key=..&time_start=..&time_end=..&device_uid=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report only for the specified trackers |

### 7.3. Stops report

#### 7.3.1. Structure

```json
{
"start_timestamp": "",
"end_timestamp": "",
"time_stop": ,
"zone_uid": "",
"location": {
"device_uid": "",
"tracker_timestamp": "",
"server_timestamp": "",
"point": {},
"satellites": ,
"speed": ,
"altitude": ,
"azimuth": ,
"sensors_values": []
}
}
```

| Field | Type | Description |
|-------|------|-------------|
| `start_timestamp` | String | stop start time |
| `end_timestamp` | String | stop end time |
| `time_stop` | Integer | stop time, s |
| `zone_uid` | String | zone (field) identifier |
| `location` | JSON | location (see tracker location) |

#### 7.3.2. URL

```http
GET /sync/reports/3/get?key=..&time_start=..&time_end=..&device_uid=..&..=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report only for the specified trackers |
| `time_stop` | filter to retrieve the report only for stop times greater than or equal to the specified value |

### 7.4. Sensors report (general)

#### 7.4.1. Structure

```json
{
"device_sensor_uid": "",
"value_min": ,
"value_max": ,
"value_avg": ,
"time_on": ,
"time_off":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_sensor_uid` | String | sensor identifier |
| `value_min` | Double | minimum value |
| `value_max` | Double | maximum value |
| `value_avg` | Double | average value |
| `time_on` | Integer | time in "On" state, s |
| `time_off` | Integer | time in "Off" state, s |

#### 7.4.2. URL

```http
GET /sync/reports/17/get?key=..&time_start=..&time_end=..&device_uid=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report for the specified tracker |

### 7.5. Sensors report (states)

#### 7.5.1. Structure

```json
{
"internal_number": ,
"start_timestamp": "",
"end_timestamp": "",
"value_min": ,
"value_max": ,
"value_avg": ,
"value": "",
"state": ,
"time": ,
"location_start": {},
"location_end": {}
}
```

| Field | Type | Description |
|-------|------|-------------|
| `internal_number` | Integer | sensor ordinal number |
| `start_timestamp` | String | state start time |
| `end_timestamp` | String | state end time |
| `value_min` | Double | minimum value (for analog sensors) |
| `value_max` | Double | maximum value (for analog sensors) |
| `value_avg` | Double | average value (for analog sensors) |
| `value` | String | value (for digital sensors) |
| `state` | Integer | state<br>0 – "On"<br>1 – "Off" |
| `time` | Integer | state duration, s |
| `location_start` | JSON | starting location |
| `location_end` | JSON | ending location |

#### 7.5.2. URL

```http
GET /sync/reports/19/get?key=..&time_start=..&time_end=..&device_uid=..&internal_number=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report for the specified tracker |
| `internal_number` | filter to retrieve the report only for the sensor with the specified ordinal number |

### 7.6. Sensors report (detailed)

#### 7.6.1. Structure

```json
{
"s": ,
"time_moto": ,
"location": {}
}
```

| Field | Type | Description |
|-------|------|-------------|
| `s` | Double | distance traveled, m |
| `time_moto` | Integer | engine running time, s |
| `time_moto_stop` | Integer | idle time, s |
| `location` | JSON | tracker location |

#### 7.6.2. URL

```http
GET /sync/reports/18/get?key=..&time_start=..&time_end=..&device_uid=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report only for the specified tracker |

### 7.7. Zones report (entry/exit)

#### 7.7.1. Structure

```json
{
"device_uid": "",
"start_timestamp": "",
"end_timestamp": "",
"time_zone": ,
"zone_uid": "",
"s": ,
"time_move": ,
"time_stop": ,
"time_moto": ,
"time_moto_stop": ,
"speed_avg": ,
"speed_max":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `start_timestamp` | String | entry time |
| `end_timestamp` | String | exit time |
| `time_zone` | Integer | time in zone, s |
| `zone_uid` | String | zone (field) identifier |
| `s` | Double | distance traveled, m |
| `time_move` | Integer | time in motion, s |
| `time_stop` | Integer | stops time, s |
| `time_moto` | Integer | engine running time, s |
| `time_moto_stop` | Integer | idle time, s |
| `speed_avg` | Integer | average speed, km/h |
| `speed_max` | Integer | maximum speed, km/h |

#### 7.7.2. URL

```http
GET /sync/reports/4/get?key=..&time_start=..&time_end=..&..=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report only for the specified trackers |
| `zone_uid` | filter to retrieve the report only for the specified zones (fields) |
| `zone` | filter to retrieve the report only for the specified geometry in GEOJSON ESPG-4326 format |
| `radius` | used to define a circle if the zone parameter is a point |
| `report_2` | filter to retrieve in the report movement information (distance traveled, time in motion, stops time, ...) true, false, 1, 0; default true |
| `time_zone` | filter to retrieve the report only for times in zone greater than or equal to the specified value |
| `time_stop` | filter to retrieve the report only for stops times in zone greater than or equal to the specified value |
| `speed_max` | filter to retrieve the report only for the maximum speed in zone greater than or equal to the specified value |

### 7.8. Events report

#### 7.8.1. Structure

```json
{
"type": ,
"event": {},
"location": {}
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | Integer | event type:<br>0 – sensor event<br>1 – zone event<br>2 – route checkpoint zone event<br>3 – route event |
| `event` | JSON | event |
| `location` | JSON | tracker location |

#### 7.8.2. URL

```http
GET /sync/reports/5/get?key=..&time_start=..&time_end=..&..=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report only for the specified trackers |
| `type` | filter to retrieve the report only for events of a specific type<br>0 – tracker sensor events<br>1 – zone events<br>2 – route checkpoint zone events<br>3 – route events. Required types can be specified separated by commas |
| `uid` | filter to retrieve the report only for the specified – tracker sensors – zone profiles – routes |
| `on` | filter to retrieve the report only for events with state<br>true – "On"<br>false – "Off" |
| `alarm` | filter to retrieve the report only for events<br>true – "Alarm"<br>false – not "Alarm" |
| `popup` | filter to retrieve the report only for events<br>true – operational<br>false – not operational |
| `confirmed` | filter to retrieve the report only for events<br>true – confirmed<br>false – not confirmed |

### 7.9. Agro report (work area)

#### 7.9.1. Structure

```json
{
"device_uid": "",
"geom": {},
"area": ,
"fuel_value_start": ,
"fuel_value_in": ,
"fuel_value_out": ,
"fuel_value_end":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `geom` | GEOJSONGeometry | geometry in GEOJSON ESPG-4326 format |
| `area` | Double | area, m2 |
| `fuel_value_start` | Double | fuel volume at the start of the period (0 for a flow-through sensor), l |
| `fuel_value_in` | Double | refueling volume (consumption for a flow-through sensor), l |
| `fuel_value_out` | Double | drained volume (0 for a flow-through sensor), l |
| `fuel_value_end` | Double | fuel volume at the end of the period (0 for a flow-through sensor), l |

#### 7.9.2. URL

```http
GET /sync/reports/51/get?key=..&time_start=..&time_end=..&device_uid=..&buffer=..&..=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report only for the specified trackers |
| `buffer` | half of the working width of the trailed equipment |
| `zone_uid` | zone (field) identifier for limiting the work area by the boundaries of the specified zone (field) |
| `geom` | filter to retrieve geometry in the report true, false, 1, 0; default false |
| `fuel` | filter to retrieve fuel consumption data in the report true, false, 1, 0; default false |

### 7.10. Agro report – Crop unloading (detailed)

#### 7.10.1. Structure

```json
{
"device_uid": "",
"server_timestamp": ,
"start_timestamp": "",
"end_timestamp": "",
"start_location": {},
"end_location": {},
"value": ,
"value_weight": ,
"device_download_rfid": "",
"device_download_uid": "",
"distance":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `server_timestamp` | String | time the unloading was registered by the server |
| `start_timestamp` | String | unloading start time |
| `end_timestamp` | String | unloading end time |
| `start_location` | JSON | tracker location at the unloading start time |
| `end_location` | JSON | tracker location at the unloading end time |
| `value` | Double | crop unloading weight in source values |
| `value_weight` | Double | crop unloading weight, kg |
| `device_download_rfid` | String | RFID of the loading tracker |
| `device_download_uid` | String | identifier of the loading tracker |
| `distance` | Double | distance between the unloading tracker and the loading tracker at the unloading start time |

#### 7.10.2. URL

```http
GET /sync/reports/30/get?key=..&time_start=..&time_end=..&device_uid=..&device_uid_download=..&rfid_download=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report only for the specified crop unloading trackers |
| `device_uid_download` | filter to retrieve the report only for the specified loading tracker |
| `rfid_download` | filter to retrieve the report only for a loading tracker whose "auto_rfid" field contains the specified RFID tag value |

### 7.11. Fuel report (general)

#### 7.11.1. Structure

```json
{
"device_uid": "",
"fuel_value_start": ,
"fuel_value_in": ,
"fuel_value_out": ,
"fuel_value_move": ,
"fuel_value_end":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `device_uid` | String | tracker identifier |
| `fuel_value_start` | Double | fuel volume at the start of the period (0 for a flow-through sensor), l |
| `fuel_value_in` | Double | refueling volume (consumption for a flow-through sensor), l |
| `fuel_value_out` | Double | drained volume (0 for a flow-through sensor), l |
| `fuel_value_move` | Double | fuel consumption in motion, l |
| `fuel_value_end` | Double | fuel volume at the end of the period (0 for a flow-through sensor), l |

#### 7.11.2. URL

```http
GET /sync/reports/52/get?key=..&time_start=..&time_end=..&device_uid=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `device_uid` | filter to retrieve the report only for the specified trackers |

### 7.12. Fuel report – Fuel dispensing (detailed)

#### 7.12.1. Structure

```json
{
"server_timestamp": "",
"fuel_terminal_timestamp": "",
"serial_number_fuel_terminal": "",
"value": ,
"driver_rfid": "",
"driver_fio": "",
"device_auto_rfid": "",
"device_name": "",
"catalog_fuel_station_uid": "",
"device_uid": "",
"value_report_6":
}
```

| Field | Type | Description |
|-------|------|-------------|
| `server_timestamp` | String | time data was received by the server |
| `fuel_terminal_timestamp` | String | time data was received by the terminal (iazs, etc.) |
| `serial_number_fuel_terminal` | String | terminal serial number (iazs, etc.) |
| `value` | Double | refueling volume (iazs, etc.) |
| `driver_rfid` | String | RFID of the driver's card |
| `driver_fio` | String | driver's full name |
| `device_auto_rfid` | String | tracker RFID |
| `device_name` | String | tracker name |
| `catalog_fuel_station_uid` | String | gas station/fuel tanker identifier |
| `device_uid` | String | identifier of the tracker for which fuel refueling was found by the system via the fuel level sensor (FLS) |
| `value_report_6` | Double | fuel refueling volume via FLS found by the system, l |

#### 7.12.2. URL

```http
GET /sync/reports/27/get?key=..&time_start=..&time_end=..&..=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
| `time_start` | filter to retrieve the report for the specified period |
| `time_end` | filter to retrieve the report for the specified period |
| `catalog_fuel_station_uid` | filter to retrieve the report only for the specified gas stations/fuel tankers |
| `device_uid` | filter to retrieve the report only for the specified trackers |

### 7.13. Routes report – Zone passage (on-line)

#### 7.13.1. Structure

```json
{
"route_schedule_device_link": {},
"route_zone_uid": "",
"arrival_plan_timestamp": "",
"arrival_fact_timestamp": "",
"departure_plan_timestamp": "",
"departure_fact_timestamp": ""
}
```

| Field | Type | Description |
|-------|------|-------------|
| `route_schedule_device_link` | JSON | schedule execution (schedule execution order) |
| `route_zone_uid` | String | route zone identifier |
| `arrival_plan_timestamp` | String | planned arrival time |
| `arrival_fact_timestamp` | String | actual arrival time |
| `departure_plan_timestamp` | String | planned departure time |
| `departure_fact_timestamp` | String | actual departure time |

#### 7.13.2. URL

```http
GET /sync/reports/22/get?key=..
```

| Parameter | Description |
|-----------|-------------|
| `key` | user's Web-API key |
