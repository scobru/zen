# ZEN — Zen Entropy Network

**ZEN** là một **offline-first decentralized graph database** được tạo ra để **thay thế GUN trong repo akao**.

Nó không sinh ra như một side project vô ích. Nó tồn tại vì `akao` cần một nền tảng graph + crypto + execution mới, kế thừa những gì tốt nhất từ GUN nhưng sửa các điểm nghẽn cốt lõi về runtime, storage, identity, và policy.

> **Carry the legacy. Fix the core. Evolve the system.**

## TL;DR cho developer mới

Nếu bạn mới đọc repo này, đây là điều quan trọng nhất cần biết:

1. **ZEN là successor định hướng từ `akaoio/gun`**, không phải một project tách rời lineage.
2. **Mục tiêu thực tế của ZEN là thay thế GUN trong akao.**
3. **PEN là core policy/execution system** và ZEN sẽ không kế thừa các lớp cũ như `SEA.certify`, user namespace, hay content-address như feature layer riêng.
4. **ZEN muốn giữ graph feeling của GUN**, nhưng tái thiết kế clock, crypto, storage, và execution model.
5. README này phân biệt rõ:
   - cái gì là **lineage đã có trong `akaoio/gun`**
   - cái gì là **định hướng của ZEN**
   - cái gì là **không được kế thừa**

## README contract

Để tránh overclaim, nên đọc README này theo 3 lớp:

### 1. Current repo reality

Repo `zen/` hiện tại vẫn đang ở giai đoạn rất sớm. README này chủ yếu mô tả:

- mục tiêu của project
- các nguyên tắc kiến trúc
- những gì được kế thừa từ `akaoio/gun`
- những gì ZEN dự định xây thành core

### 2. Inherited lineage from `akaoio/gun`

Những ý sau **đã có nền tảng trong fork `akaoio/gun`**:

- OPFS adapter qua `gun/lib/opfs.js`
- worker / `globalThis` compatibility trong nhiều `lib/` modules
- PEN runtime bằng `pen.wasm`
- base62 pack/unpack cho PEN bytecode soul
- seed-based keys, authenticators, và các mở rộng crypto khác trong fork

### 3. ZEN direction

Những ý sau là **định hướng kiến trúc cho ZEN**:

- Zig -> WASM-first compute
- unified API cho data + crypto + execution
- `zen.now` candle clock
- metadata node giữ shape kiểu GUN nhưng state semantics đi theo clock riêng của ZEN
- PEN trở thành lớp policy/execution trung tâm của toàn hệ

## Vì sao ZEN tồn tại

ZEN tồn tại vì GUN và SEA, dù rất mạnh về ý tưởng, đã lộ ra những giới hạn rõ ràng cho mục tiêu production của `akao`.

### Những vấn đề ZEN muốn xử lý

#### 1. CommonJS-first và side effects

- không thuận với ESM hiện đại
- phụ thuộc `window`
- dễ tạo import side-effects

#### 2. Compute bị khóa trong JavaScript

Điều này không lý tưởng cho:

- hashing
- cryptography
- execution logic
- policy VM

#### 3. Storage chưa phải baseline tối ưu cho hướng local-first mới

- GUN cổ điển gắn nhiều với IndexedDB / RAD plugins
- không phải hướng storage tối ưu nhất cho compute-heavy và WASM-oriented design

#### 4. Worker story chưa phải trung tâm

Fork `akaoio/gun` đã cải thiện phần này, nhưng với ZEN thì đây phải là nguyên lý kiến trúc ngay từ đầu.

#### 5. SEA không còn là lớp policy cuối cùng

SEA cung cấp nhiều thứ hữu ích, nhưng với định hướng hiện tại thì:

- `SEA.certify`
- user namespace model
- các lớp auth/policy cũ

không còn là trung tâm nữa.

Trong `akaoio/gun`, PEN đã đủ mạnh để gánh phần authorization và execution phức tạp hơn. Vì vậy ZEN không xem các lớp trên là first-class feature cần kế thừa.

## ZEN kế thừa gì từ `akaoio/gun`

ZEN không phủ nhận GUN. ZEN kế thừa những thứ quan trọng nhất từ lineage này:

- graph-first thinking
- offline-first sync mindset
- CRDT / HAM intuition
- P2P orientation
- OPFS reuse qua `gun/lib/opfs.js`
- worker-compatible direction
- PEN như bytecode policy/runtime
- base62-friendly bytecode identity packing

Nói ngắn gọn: **ZEN không phá bỏ lineage. ZEN chọn lọc nó.**

## ZEN sẽ không kế thừa gì

Đây là phần cần nói rõ để tránh hiểu nhầm.

ZEN **không** muốn tiếp tục mang các lớp sau như first-class architecture:

- `SEA.certify`
- user namespace model
- content-address như một feature layer độc lập
- SEA-style prefixed/enveloped crypto formats
- tư duy auth/session dựa trên wrapper layer thay vì policy layer

Lý do là vì ZEN muốn một hệ thống thống nhất hơn:

- crypto ở core
- policy ở PEN
- execution ở core
- graph metadata có logic riêng

chứ không chồng nhiều lớp feature lịch sử lên nhau.

## Định hướng kiến trúc

### 1. Compute: Zig -> WASM

**Định hướng ZEN:** compute nặng sẽ đi qua Zig và WASM.

Mục tiêu:

- nhanh hơn cho cryptography và hashing
- phù hợp với bytecode / VM execution
- portable giữa browser / server / edge

### 2. Storage: OPFS

**Lineage đã có:** `akaoio/gun` đã có `lib/opfs.js`.

ZEN không cần phát minh lại OPFS. Hướng đúng là:

- tái sử dụng `gun/lib/opfs.js`
- tận dụng logic detect / fallback đã có
- chỉ thay đổi nếu ZEN thật sự cần storage contract mới

Lợi ích:

- giảm chi phí maintain
- giữ continuity với lineage
- tập trung effort vào phần khác biệt thực sự của ZEN

### 3. Network

ZEN vẫn nằm trong hướng:

- WebSocket
- WebRTC mesh
- decentralized sync

Đây là phần kế thừa tinh thần GUN, không phải phần cần vứt bỏ.

### 4. CRDT + HAM

ZEN vẫn favor deterministic conflict resolution.

Điều quan trọng là:

- ZEN vẫn giữ trực giác graph conflict kiểu GUN
- nhưng clock semantics sẽ được thiết kế lại để phù hợp với PEN và candle model

## Metadata và candle clock

Đây là một trong những điểm phân biệt quan trọng nhất.

### Metadata shape

**Định hướng ZEN:** metadata của node sẽ giữ **shape giống node của GUN** để tương thích với graph model quen thuộc.

Nhưng phần `state` trong metadata sẽ **không dùng `Gun.state`**.

### `zen.now`

Thay vào đó, `zen.now` phụ thuộc vào param `candle` khi init instance:

```js
const zen = new Zen({ candle })
zen.now = Math.floor(Date.now() / candle)
```

Nếu không truyền `candle`, thì mặc định:

```js
const zen = new Zen()
// candle = 1
```

Nếu muốn `zen.now` quay về nhịp thời gian bình thường:

```js
const zen = new Zen({ candle: 1 })
```

### Ý nghĩa của candle model

Đây là tư duy **candle clock** trong PEN:

- state không còn là millisecond clock kiểu cũ
- policy, execution, và sync có thể dựa trên cùng một nhịp candle
- mỗi instance có thể chọn clock granularity riêng
- ZEN có thể xây một hệ clock riêng thay vì bị trói vào `Gun.state()`

## PEN là core

PEN không phải addon. PEN là lớp **policy + execution + bytecode identity** trung tâm.

### Lineage hiện có

Trong `akaoio/gun`, PEN đã có nền tảng thực tế:

- runtime bằng `pen.wasm`
- base62 packing / unpacking
- bytecode attached to soul identity

### Định hướng ZEN

ZEN muốn đẩy PEN lên thành core thực thụ:

- không phải feature phụ
- không phải extension add-on
- không phải thứ chỉ phục vụ authorization

Mục tiêu cuối cùng là:

> mọi dữ liệu trong ZEN đều có thể mang logic thực thi

## Soul model

Khác với cách nghĩ GUN + SEA cổ điển:

> trong định hướng ZEN, mọi soul đều có thể mang bản chất ZEN / PEN

Điều này hợp nhất:

- data
- logic
- execution

Tuy vậy, phần này nên được hiểu là **ZEN direction**, không phải tuyên bố rằng repo hiện tại đã hoàn thiện model đó.

## Crypto foundation

ZEN favor:

> **secp256k1** làm crypto baseline

thay vì P256 như SEA.

### Vì sao

- hợp với blockchain / wallet ecosystem
- deterministic key generation (`seed -> key`)
- hợp với decentralized identity
- tooling ecosystem mạnh hơn

### Encoding stance

ZEN favor **base62**.

Đây cũng không phải ý tưởng hoàn toàn mới, vì trong `akaoio/gun`:

- PEN bytecode đã dùng base62 packing
- lineage đã nghiêng về base62-friendly identifiers

Vì vậy README nên xem đây là **continuity**, không chỉ là sở thích mới của ZEN.

## Clean JSON crypto

Một rule quan trọng của ZEN:

- `sign`
- `verify`
- `encrypt`
- `decrypt`

sẽ làm việc với **JSON thuần**, không ép developer dùng prefix kiểu `SEA` hay envelope format mang dấu ấn lịch sử của SEA.

Mục tiêu:

- payload sạch hơn
- dễ reason hơn
- dễ đi qua network / storage / worker / WASM boundary hơn

## Unified API direction

Định hướng API của ZEN là hợp nhất data, crypto, và execution trong một interface.

Ví dụ ý tưởng:

```js
const zen = new Zen({ candle: 60000 })

zen.get(key)
zen.put(data)

zen.hash(data)

const pair = zen.pair()
const sig = zen.sign(data, pair)
zen.verify(data, sig, pair.pub)

zen(penObject)
```

Phần này nên được đọc như **API direction**, không phải khẳng định rằng toàn bộ API này đã được hiện thực đầy đủ trong repo `zen/` hôm nay.

## Vai trò thực tế của ZEN trong akao

ZEN không phải experiment mơ hồ.

Nó được tạo ra để:

- thay thế GUN trong repo `akao`
- trở thành nền graph/crypto/execution mới cho hệ sinh thái đó
- đưa PEN thành policy core thật sự

Nói cách khác: **akao là lý do tồn tại của ZEN**.

## Fork lineage

ZEN là successor direction xuất phát từ:

> GUN -> `akaoio/gun` -> ZEN

Nó kế thừa:

- tinh thần graph/offline-first/P2P của GUN
- các mở rộng thực tế đã có trong `akaoio/gun`
- hướng đi nơi PEN trở thành nền tảng chính

## Triết lý thiết kế

- Không phá bỏ -> kế thừa
- Không vá lỗi -> tái kiến trúc
- Không tách data và crypto -> unified
- Không đặt policy ở wrapper layer -> đưa về core qua PEN
- Không để clock semantics bị khóa trong mô hình cũ -> xây clock riêng cho ZEN

## Nên cải thiện README tiếp theo ở đâu

README sau bản này vẫn nên tiếp tục được cải thiện theo hướng:

1. thêm một section **Current implementation status** khi repo bắt đầu có code thật
2. thêm sơ đồ lineage `GUN -> akaoio/gun -> ZEN`
3. thêm bảng “Inherited / Rejected / Planned”
4. thêm examples cụ thể khi ZEN có API chạy được
5. giữ mọi claim được gắn nhãn rõ là:
   - current reality
   - inherited lineage
   - design direction

## Kết luận

ZEN là một **decentralized graph database thế hệ mới** được tạo ra để đưa lineage của GUN sang một kiến trúc phù hợp hơn với:

- akao
- secp256k1 identity
- PEN-centric policy
- OPFS / worker / WASM direction
- unified graph + crypto + execution

Nó không phủ nhận GUN. Nó chọn kế thừa cái đúng, bỏ cái dư thừa, và xây tiếp phần còn thiếu.
