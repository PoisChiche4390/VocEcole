
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const germanWords = writable([
      {
        id: 1,
        forLessen: false,
        content: "Kapitel 3"
      },
      {
        id: 2,
        forLesson: true,
        german: 'überall',
        germanWithoutMisspeling: 'überall',
        french: 'partout'
      },
      {
        id: 3,
        forLesson: true,
        german: 'die Öffnungszeiten',
        germanWithoutMisspeling: 'dieöffnungszeiten',
        french: "les heures d'ouverture"
      },
      {
        id: 4,
        forLesson: true,
        german: 'die Fussgängerzone, die Fussgängerzonen',
        germanWithoutMisspeling: 'diefussgängerzone,diefussgängerzonen',
        french: 'la zone piétonne, les zones piétonnes'
      },
      {
        id: 5,
        forLesson: true,
        german: 'der Laden, die Laden',
        germanWithoutMisspeling: 'derladen,dieladen',
        french: 'le magasin, les magasins'
      },
      {
        id: 6,
        forLesson: true,
        german: 'Ich kaufe lieber in kleinen Läden ein.',
        germanWithoutMisspeling: 'ichkaufelieberinkleinenlädenein.',
        french: 'Je préfère acheter dans des petits commerces.'
      },
      {
        id: 7,
        forLesson: true,
        german: 'die Beratung',
        germanWithoutMisspeling: 'dieberatung',
        french: 'le conseil'
      },
      {
        id: 8,
        forLesson: true,
        german: 'Die Beratung im Geschäft war sehr gut.',
        germanWithoutMisspeling: 'dieberatungimgeschäftwarsehrgut.',
        french: 'Le conseil dans le magasin était très bien.'
      },
      {
        id: 9,
        forLesson: true,
        german: 'teilen, teilt, hat geteilt',
        germanWithoutMisspeling: 'teilen,teilt,hatgeteilt',
        french: 'partager (3 formes)'
      },
      {
        id: 10,
        forLesson: true,
        german: 'brauchen, braucht, hat gebraucht',
        germanWithoutMisspeling: 'brauchen,braucht,hatgebraucht',
        french: 'avoir besoin de (3 formes)'
      },
      {
        id: 11,
        forLesson: true,
        german: 'weniger ≠ mehr',
        germanWithoutMisspeling: 'wenigermehr',
        french: 'moins ≠ plus'
      },
      {
        id: 12,
        forLesson: true,
        german: 'immer mehr',
        germanWithoutMisspeling: 'immermehr',
        french: 'toujours plus'
      },
      {
        id: 13,
        forLesson: true,
        german: 'verzichten auf, verzichtet, hat verzichtet',
        germanWithoutMisspeling: 'verzichtenauf,verzichtet,hatverzichtet',
        french: 'renoncer à (3 formes)'
      },
      {
        id: 14,
        forLesson: true,
        german: 'Ich möchte nicht auf meine Musik verzichten.',
        germanWithoutMisspeling: 'ichmöchtenichtaufmeinemusikverzichten.',
        french: 'Je ne voudrais pas renoncer à ma musique.'
      },
      {
        id: 15,
        forLesson: true,
        german: 'besitzen, besitzt, besass, hat besessen',
        germanWithoutMisspeling: 'besitzenbesitztbesasshatbesessen',
        french: 'posséder (4 formes)'
      },
      {
        id: 16,
        forLesson: true,
        german: 'Er besitzt ein Haus.',
        germanWithoutMisspeling: 'erbesitzteinhaus.',
        french: 'Il possède une maison.'
      },
      {
        id: 17,
        forLesson: true,
        german: 'Ich habe nicht viel/genug Platz.',
        germanWithoutMisspeling: 'ichhabenichtviel/genugplatz.',
        french: "Je n'ai pas beaucoup/assez de place."
      },
      {
        id: 18,
        forLesson: true,
        german: 'Ich habe (sehr) wenig Platz.',
        germanWithoutMisspeling: 'ichhabe(sehr)wenigplatz.',
        french: "J'ai (très) peu de place."
      },
      {
        id: 19,
        forLesson: true,
        german: 'verdienen, verdient, hat verdient',
        germanWithoutMisspeling: 'verdienen,verdient,hatverdient',
        french: "gagner de l'argent (3 formes)"
      },
      {
        id: 20,
        forLesson: true,
        german: '',
        germanWithoutMisspeling: '',
        french: ''
      },
      {
        id: 21,
        forLesson: true,
        german: '',
        germanWithoutMisspeling: '',
        french: ''
      },
      {
        id: 22,
        forLesson: true,
        german: '',
        germanWithoutMisspeling: '',
        french: ''
      },
      {
        id: 23,
        forLesson: true,
        german: '',
        germanWithoutMisspeling: '',
        french: ''
      },
    ]);

    const selectedGermanWords = writable([]);

    /* src\components\GermanWords.svelte generated by Svelte v3.59.2 */
    const file$7 = "src\\components\\GermanWords.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[18] = list;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (90:8) {:else}
    function create_else_block$1(ctx) {
    	let p;
    	let t_value = /*germanWord*/ ctx[17].content + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "info svelte-z4el46");
    			add_location(p, file$7, 90, 10, 2791);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*actualWordsPage*/ 2 && t_value !== (t_value = /*germanWord*/ ctx[17].content + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(90:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (83:8) {#if germanWord.forLesson == true}
    function create_if_block$2(ctx) {
    	let label;
    	let input;
    	let t0;
    	let t1_value = /*germanWord*/ ctx[17].german + "";
    	let t1;
    	let t2;
    	let t3_value = /*germanWord*/ ctx[17].french + "";
    	let t3;
    	let t4;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[10].call(input, /*each_value*/ ctx[18], /*germanWord_index*/ ctx[19]);
    	}

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[11](/*germanWord*/ ctx[17], ...args);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = text(" = ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$7, 84, 10, 2544);
    			attr_dev(label, "class", "checkbox-container svelte-z4el46");
    			add_location(label, file$7, 83, 8, 2498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = /*germanWord*/ ctx[17].checked;
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);
    			append_dev(label, t3);
    			append_dev(label, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", input_change_handler),
    					listen_dev(input, "change", change_handler, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*actualWordsPage*/ 2) {
    				input.checked = /*germanWord*/ ctx[17].checked;
    			}

    			if (dirty & /*actualWordsPage*/ 2 && t1_value !== (t1_value = /*germanWord*/ ctx[17].german + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*actualWordsPage*/ 2 && t3_value !== (t3_value = /*germanWord*/ ctx[17].french + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(83:8) {#if germanWord.forLesson == true}",
    		ctx
    	});

    	return block;
    }

    // (82:6) {#each actualWordsPage as germanWord (germanWord.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*germanWord*/ ctx[17].forLesson == true) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(82:6) {#each actualWordsPage as germanWord (germanWord.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div2;
    	let div0;
    	let form;
    	let label;
    	let input;
    	let input_checked_value;
    	let t0;
    	let t1_value = /*actualPage*/ ctx[0] + 1 + "";
    	let t1;
    	let t2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t3;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let span;
    	let t5;
    	let t6_value = /*actualPage*/ ctx[0] + 1 + "";
    	let t6;
    	let t7;
    	let img1;
    	let img1_src_value;
    	let mounted;
    	let dispose;
    	let each_value = /*actualWordsPage*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*germanWord*/ ctx[17].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			form = element("form");
    			label = element("label");
    			input = element("input");
    			t0 = text("\r\n        Select all on page ");
    			t1 = text(t1_value);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t4 = space();
    			span = element("span");
    			t5 = text("page ");
    			t6 = text(t6_value);
    			t7 = space();
    			img1 = element("img");
    			attr_dev(input, "type", "checkbox");
    			input.checked = input_checked_value = /*actualWordsPage*/ ctx[1].every(func);
    			add_location(input, file$7, 76, 8, 2186);
    			attr_dev(label, "class", "select-all svelte-z4el46");
    			add_location(label, file$7, 75, 6, 2150);
    			add_location(form, file$7, 74, 4, 2136);
    			attr_dev(div0, "class", "wordsContainer svelte-z4el46");
    			add_location(div0, file$7, 73, 2, 2102);
    			if (!src_url_equal(img0.src, img0_src_value = "/img/leftArrow.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-z4el46");
    			add_location(img0, file$7, 96, 4, 2914);
    			attr_dev(span, "class", "actual-page svelte-z4el46");
    			add_location(span, file$7, 97, 4, 2999);
    			if (!src_url_equal(img1.src, img1_src_value = "/img/rightArrow.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-z4el46");
    			add_location(img1, file$7, 98, 4, 3059);
    			attr_dev(div1, "class", "arrows svelte-z4el46");
    			add_location(div1, file$7, 95, 2, 2888);
    			attr_dev(div2, "class", "german-words-list svelte-z4el46");
    			add_location(div2, file$7, 72, 0, 2067);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, form);
    			append_dev(form, label);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(form, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(form, null);
    				}
    			}

    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t4);
    			append_dev(div1, span);
    			append_dev(span, t5);
    			append_dev(span, t6);
    			append_dev(div1, t7);
    			append_dev(div1, img1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*toggleCheckAll*/ ctx[5], false, false, false, false),
    					listen_dev(img0, "click", prevent_default(/*click_handler*/ ctx[12]), false, true, false, false),
    					listen_dev(img1, "click", prevent_default(/*click_handler_1*/ ctx[13]), false, true, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*actualWordsPage*/ 2 && input_checked_value !== (input_checked_value = /*actualWordsPage*/ ctx[1].every(func))) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*actualPage*/ 1 && t1_value !== (t1_value = /*actualPage*/ ctx[0] + 1 + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*actualWordsPage, changeWord*/ 18) {
    				each_value = /*actualWordsPage*/ ctx[1];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, form, destroy_block, create_each_block, null, get_each_context);
    			}

    			if (dirty & /*actualPage*/ 1 && t6_value !== (t6_value = /*actualPage*/ ctx[0] + 1 + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = word => word.checked;

    function instance$7($$self, $$props, $$invalidate) {
    	let startIndex;
    	let endIndex;
    	let actualWordsPage;
    	let $germanWords;
    	validate_store(germanWords, 'germanWords');
    	component_subscribe($$self, germanWords, $$value => $$invalidate(9, $germanWords = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GermanWords', slots, []);
    	let actualPage = 0;
    	let pageSize = 10;
    	let width = screen.width;
    	let height = screen.height;
    	const delay = ms => new Promise(res => setTimeout(res, ms));

    	const leftArrowClick = () => {
    		if (actualPage === 0) {
    			$$invalidate(0, actualPage = Math.ceil($germanWords.length / pageSize) - 1);
    		} else {
    			$$invalidate(0, actualPage = actualPage - 1);
    		}
    	};

    	const rightArrowClick = () => {
    		if (actualPage === Math.ceil($germanWords.length / pageSize) - 1) {
    			$$invalidate(0, actualPage = 0);
    		} else {
    			$$invalidate(0, actualPage++, actualPage);
    		}
    	};

    	const changeWord = (event, germanWord) => {
    		const isChecked = event.target.checked;

    		if (isChecked) {
    			selectedGermanWords.update(selectedWords => {
    				// Include the word in the array if it's not already present
    				if (!selectedWords.some(word => word.id === germanWord.id)) {
    					return [...selectedWords, germanWord];
    				}

    				return selectedWords;
    			});
    		} else {
    			selectedGermanWords.update(selectedWords => {
    				// Remove the word from the array
    				return selectedWords.filter(word => word.id !== germanWord.id);
    			});
    		}
    	};

    	const toggleCheckAll = async e => {
    		const isChecked = e.target.checked;

    		actualWordsPage.forEach(germanWord => {
    			germanWord.checked = isChecked;
    			changeWord({ target: { checked: isChecked } }, germanWord);
    		});

    		rightArrowClick();
    		await delay(0.000000000000000000000000000000000000000000000000000000001);
    		leftArrowClick();
    	};

    	// $: console.log($selectedGermanWordsStore)
    	onDestroy(() => {
    		
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GermanWords> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler(each_value, germanWord_index) {
    		each_value[germanWord_index].checked = this.checked;
    		((((((($$invalidate(1, actualWordsPage), $$invalidate(9, $germanWords)), $$invalidate(8, startIndex)), $$invalidate(7, endIndex)), $$invalidate(0, actualPage)), $$invalidate(6, pageSize)), $$invalidate(14, width)), $$invalidate(15, height));
    	}

    	const change_handler = (germanWord, event) => changeWord(event, germanWord);
    	const click_handler = () => leftArrowClick();
    	const click_handler_1 = () => rightArrowClick();

    	$$self.$capture_state = () => ({
    		onDestroy,
    		germanWords,
    		selectedGermanWordsStore: selectedGermanWords,
    		actualPage,
    		pageSize,
    		width,
    		height,
    		delay,
    		leftArrowClick,
    		rightArrowClick,
    		changeWord,
    		toggleCheckAll,
    		endIndex,
    		startIndex,
    		actualWordsPage,
    		$germanWords
    	});

    	$$self.$inject_state = $$props => {
    		if ('actualPage' in $$props) $$invalidate(0, actualPage = $$props.actualPage);
    		if ('pageSize' in $$props) $$invalidate(6, pageSize = $$props.pageSize);
    		if ('width' in $$props) $$invalidate(14, width = $$props.width);
    		if ('height' in $$props) $$invalidate(15, height = $$props.height);
    		if ('endIndex' in $$props) $$invalidate(7, endIndex = $$props.endIndex);
    		if ('startIndex' in $$props) $$invalidate(8, startIndex = $$props.startIndex);
    		if ('actualWordsPage' in $$props) $$invalidate(1, actualWordsPage = $$props.actualWordsPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*actualPage, pageSize*/ 65) {
    			$$invalidate(8, startIndex = actualPage * pageSize);
    		}

    		if ($$self.$$.dirty & /*startIndex, pageSize*/ 320) {
    			$$invalidate(7, endIndex = startIndex + pageSize);
    		}

    		if ($$self.$$.dirty & /*$germanWords, startIndex, endIndex*/ 896) {
    			$$invalidate(1, actualWordsPage = $germanWords.slice(startIndex, endIndex));
    		}
    	};

    	if (width < 1200 && height < 2550) {
    		$$invalidate(6, pageSize = 6);
    	} else {
    		$$invalidate(6, pageSize = 10);
    	}

    	return [
    		actualPage,
    		actualWordsPage,
    		leftArrowClick,
    		rightArrowClick,
    		changeWord,
    		toggleCheckAll,
    		pageSize,
    		endIndex,
    		startIndex,
    		$germanWords,
    		input_change_handler,
    		change_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class GermanWords extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GermanWords",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut, axis = 'y' } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const primary_property = axis === 'y' ? 'height' : 'width';
        const primary_property_value = parseFloat(style[primary_property]);
        const secondary_properties = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
        const capitalized_secondary_properties = secondary_properties.map((e) => `${e[0].toUpperCase()}${e.slice(1)}`);
        const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
        const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
        const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
        const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
        const border_width_start_value = parseFloat(style[`border${capitalized_secondary_properties[0]}Width`]);
        const border_width_end_value = parseFloat(style[`border${capitalized_secondary_properties[1]}Width`]);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `${primary_property}: ${t * primary_property_value}px;` +
                `padding-${secondary_properties[0]}: ${t * padding_start_value}px;` +
                `padding-${secondary_properties[1]}: ${t * padding_end_value}px;` +
                `margin-${secondary_properties[0]}: ${t * margin_start_value}px;` +
                `margin-${secondary_properties[1]}: ${t * margin_end_value}px;` +
                `border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;` +
                `border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src\shared\Button.svelte generated by Svelte v3.59.2 */

    const file$6 = "src\\shared\\Button.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_style(button, "margin", /*margin*/ ctx[0]);
    			attr_dev(button, "class", "svelte-kp1x0s");
    			toggle_class(button, "blue", /*color*/ ctx[1] === 'duolingo-button-blue');
    			toggle_class(button, "green", /*color*/ ctx[1] === 'duolingo-button-green');
    			toggle_class(button, "red", /*color*/ ctx[1] === 'duolingo-button-red');
    			add_location(button, file$6, 5, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*margin*/ 1) {
    				set_style(button, "margin", /*margin*/ ctx[0]);
    			}

    			if (!current || dirty & /*color*/ 2) {
    				toggle_class(button, "blue", /*color*/ ctx[1] === 'duolingo-button-blue');
    			}

    			if (!current || dirty & /*color*/ 2) {
    				toggle_class(button, "green", /*color*/ ctx[1] === 'duolingo-button-green');
    			}

    			if (!current || dirty & /*color*/ 2) {
    				toggle_class(button, "red", /*color*/ ctx[1] === 'duolingo-button-red');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { margin = 0 } = $$props;
    	let { color = 'duolingo-button-blue' } = $$props;
    	const writable_props = ['margin', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('margin' in $$props) $$invalidate(0, margin = $$props.margin);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ margin, color });

    	$$self.$inject_state = $$props => {
    		if ('margin' in $$props) $$invalidate(0, margin = $$props.margin);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [margin, color, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { margin: 0, color: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get margin() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set margin(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\GermanCourse.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$5 = "src\\components\\GermanCourse.svelte";

    // (140:6) {#if wordHelp == true}
    function create_if_block_4$1(ctx) {
    	let p;
    	let t_value = /*currentWord*/ ctx[10].german + "";
    	let t;
    	let p_intro;
    	let p_outro;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "help svelte-1jnti6x");
    			add_location(p, file$5, 140, 8, 3953);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*currentWord*/ 1024) && t_value !== (t_value = /*currentWord*/ ctx[10].german + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;
    				if (p_outro) p_outro.end(1);
    				p_intro = create_in_transition(p, fade, {});
    				p_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (p_intro) p_intro.invalidate();

    			if (local) {
    				p_outro = create_out_transition(p, scale, {});
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_outro) p_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(140:6) {#if wordHelp == true}",
    		ctx
    	});

    	return block;
    }

    // (149:4) {:else}
    function create_else_block_1(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "spellcheck", "false");
    			attr_dev(textarea, "cols", "5");
    			attr_dev(textarea, "rows", "15");
    			attr_dev(textarea, "maxlength", "175");
    			attr_dev(textarea, "class", "svelte-1jnti6x");
    			add_location(textarea, file$5, 149, 4, 4386);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*translatedCurrentWord*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler_1*/ ctx[26]),
    					listen_dev(textarea, "keypress", /*keypress_handler_2*/ ctx[27], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*translatedCurrentWord*/ 1) {
    				set_input_value(textarea, /*translatedCurrentWord*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(149:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (147:4) {#if readOnly == true}
    function create_if_block_3$1(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			textarea.readOnly = true;
    			attr_dev(textarea, "spellcheck", "false");
    			attr_dev(textarea, "cols", "5");
    			attr_dev(textarea, "rows", "15");
    			attr_dev(textarea, "maxlength", "175");
    			attr_dev(textarea, "class", "svelte-1jnti6x");
    			add_location(textarea, file$5, 147, 4, 4205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*translatedCurrentWord*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[24]),
    					listen_dev(textarea, "keypress", /*keypress_handler_1*/ ctx[25], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*translatedCurrentWord*/ 1) {
    				set_input_value(textarea, /*translatedCurrentWord*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(147:4) {#if readOnly == true}",
    		ctx
    	});

    	return block;
    }

    // (164:4) {:else}
    function create_else_block(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: /*color*/ ctx[1],
    				margin: "" + (/*margin1*/ ctx[4] + "px 0"),
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_4*/ ctx[31]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "class", "colored-bottom svelte-1jnti6x");
    			set_style(div, "background", /*background*/ ctx[7]);
    			set_style(div, "margin-top", /*margin3*/ ctx[6] + "px");
    			add_location(div, file$5, 164, 6, 5512);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty[0] & /*color*/ 2) button_changes.color = /*color*/ ctx[1];
    			if (dirty[0] & /*margin1*/ 16) button_changes.margin = "" + (/*margin1*/ ctx[4] + "px 0");

    			if (dirty[1] & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (!current || dirty[0] & /*background*/ 128) {
    				set_style(div, "background", /*background*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*margin3*/ 64) {
    				set_style(div, "margin-top", /*margin3*/ ctx[6] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(164:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (159:34) 
    function create_if_block_2$1(ctx) {
    	let div;
    	let button;
    	let t0;
    	let p;
    	let t1;
    	let t2_value = /*currentWord*/ ctx[10].german + "";
    	let t2;
    	let current;

    	button = new Button({
    			props: {
    				color: /*color*/ ctx[1],
    				margin: "" + (/*margin1*/ ctx[4] + "px 0"),
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_3*/ ctx[30]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			t0 = space();
    			p = element("p");
    			t1 = text("La bonne réponse était: ");
    			t2 = text(t2_value);
    			attr_dev(p, "class", "wrong-answer svelte-1jnti6x");
    			add_location(p, file$5, 161, 6, 5407);
    			attr_dev(div, "class", "colored-bottom svelte-1jnti6x");
    			set_style(div, "background", /*background*/ ctx[7]);
    			set_style(div, "margin-top", /*margin3*/ ctx[6] + "px");
    			add_location(div, file$5, 159, 4, 5212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty[0] & /*color*/ 2) button_changes.color = /*color*/ ctx[1];
    			if (dirty[0] & /*margin1*/ 16) button_changes.margin = "" + (/*margin1*/ ctx[4] + "px 0");

    			if (dirty[1] & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			if ((!current || dirty[0] & /*currentWord*/ 1024) && t2_value !== (t2_value = /*currentWord*/ ctx[10].german + "")) set_data_dev(t2, t2_value);

    			if (!current || dirty[0] & /*background*/ 128) {
    				set_style(div, "background", /*background*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*margin3*/ 64) {
    				set_style(div, "margin-top", /*margin3*/ ctx[6] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(159:34) ",
    		ctx
    	});

    	return block;
    }

    // (156:42) 
    function create_if_block_1$1(ctx) {
    	let p;
    	let t1;
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: /*color*/ ctx[1],
    				margin: "" + (/*margin1*/ ctx[4] + "px 0"),
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_2*/ ctx[29]);

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Il doit y avoir plus d'un charactère";
    			t1 = space();
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(p, "class", "not-enough-characters svelte-1jnti6x");
    			add_location(p, file$5, 156, 6, 4899);
    			attr_dev(div, "class", "colored-bottom svelte-1jnti6x");
    			set_style(div, "background", /*background*/ ctx[7]);
    			set_style(div, "margin-top", /*margin1*/ ctx[4] - 25 + "px");
    			add_location(div, file$5, 157, 6, 4980);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty[0] & /*color*/ 2) button_changes.color = /*color*/ ctx[1];
    			if (dirty[0] & /*margin1*/ 16) button_changes.margin = "" + (/*margin1*/ ctx[4] + "px 0");

    			if (dirty[1] & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (!current || dirty[0] & /*background*/ 128) {
    				set_style(div, "background", /*background*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*margin1*/ 16) {
    				set_style(div, "margin-top", /*margin1*/ ctx[4] - 25 + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(156:42) ",
    		ctx
    	});

    	return block;
    }

    // (153:4) {#if translatedCurrentWord.length > 174}
    function create_if_block$1(ctx) {
    	let p;
    	let t1;
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				color: /*color*/ ctx[1],
    				margin: "" + (/*margin1*/ ctx[4] + "px 0"),
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_1*/ ctx[28]);

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Calme, stresse pas";
    			t1 = space();
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(p, "class", "max-characters svelte-1jnti6x");
    			add_location(p, file$5, 153, 6, 4606);
    			attr_dev(div, "class", "colored-bottom svelte-1jnti6x");
    			set_style(div, "background", /*background*/ ctx[7]);
    			set_style(div, "margin-top", /*margin2*/ ctx[5] + "px");
    			add_location(div, file$5, 154, 6, 4662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty[0] & /*color*/ 2) button_changes.color = /*color*/ ctx[1];
    			if (dirty[0] & /*margin1*/ 16) button_changes.margin = "" + (/*margin1*/ ctx[4] + "px 0");

    			if (dirty[1] & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (!current || dirty[0] & /*background*/ 128) {
    				set_style(div, "background", /*background*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*margin2*/ 32) {
    				set_style(div, "margin-top", /*margin2*/ ctx[5] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(153:4) {#if translatedCurrentWord.length > 174}",
    		ctx
    	});

    	return block;
    }

    // (165:92) <Button color={color} margin="{margin1}px 0" on:click={() => submitWord()}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Confirmer");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(165:92) <Button color={color} margin=\\\"{margin1}px 0\\\" on:click={() => submitWord()}>",
    		ctx
    	});

    	return block;
    }

    // (161:6) <Button color={color} margin="{margin1}px 0" on:click={() => submitWord()}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Confirmer");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(161:6) <Button color={color} margin=\\\"{margin1}px 0\\\" on:click={() => submitWord()}>",
    		ctx
    	});

    	return block;
    }

    // (158:97) <Button color={color} margin="{margin1}px 0" on:click={() => submitWord()}>
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Confirmer");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(158:97) <Button color={color} margin=\\\"{margin1}px 0\\\" on:click={() => submitWord()}>",
    		ctx
    	});

    	return block;
    }

    // (155:92) <Button color={color} margin="{margin1}px 0" on:click={() => submitWord()}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Confirmer");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(155:92) <Button color={color} margin=\\\"{margin1}px 0\\\" on:click={() => submitWord()}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div6;
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let div4;
    	let h2;
    	let t2;
    	let div3;
    	let t3;
    	let p;
    	let t4_value = /*currentWord*/ ctx[10].french + "";
    	let t4;
    	let t5;
    	let div5;
    	let t6;
    	let current_block_type_index;
    	let if_block2;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*wordHelp*/ ctx[8] == true && create_if_block_4$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*readOnly*/ ctx[2] == true) return create_if_block_3$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	const if_block_creators = [create_if_block$1, create_if_block_1$1, create_if_block_2$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*translatedCurrentWord*/ ctx[0].length > 174) return 0;
    		if (/*notEnoughCharacters*/ ctx[9] == true) return 1;
    		if (/*wrongAnswer*/ ctx[3] == true) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Traduis :";
    			t2 = space();
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			p = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			div5 = element("div");
    			if_block1.c();
    			t6 = space();
    			if_block2.c();
    			attr_dev(div0, "class", "pourcentage-contrast svelte-1jnti6x");
    			add_location(div0, file$5, 133, 6, 3762);
    			attr_dev(div1, "class", "pourcentage svelte-1jnti6x");
    			set_style(div1, "width", /*$tweenedScore*/ ctx[11] + "%");
    			add_location(div1, file$5, 132, 4, 3696);
    			attr_dev(div2, "class", "course-pourcentage svelte-1jnti6x");
    			add_location(div2, file$5, 131, 2, 3658);
    			attr_dev(h2, "class", "svelte-1jnti6x");
    			add_location(h2, file$5, 137, 4, 3860);
    			attr_dev(p, "class", "words svelte-1jnti6x");
    			add_location(p, file$5, 142, 6, 4038);
    			attr_dev(div3, "class", "words-container svelte-1jnti6x");
    			add_location(div3, file$5, 138, 4, 3884);
    			attr_dev(div4, "class", "orinal-words svelte-1jnti6x");
    			add_location(div4, file$5, 136, 2, 3828);
    			attr_dev(div5, "class", "translate-to-french svelte-1jnti6x");
    			add_location(div5, file$5, 145, 2, 4138);
    			attr_dev(div6, "class", "course svelte-1jnti6x");
    			add_location(div6, file$5, 130, 0, 3634);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div6, t0);
    			append_dev(div6, div4);
    			append_dev(div4, h2);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, p);
    			append_dev(p, t4);
    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			if_block1.m(div5, null);
    			append_dev(div5, t6);
    			if_blocks[current_block_type_index].m(div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keypress", /*keypress_handler*/ ctx[22], false, false, false, false),
    					listen_dev(p, "click", /*click_handler*/ ctx[23], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*$tweenedScore*/ 2048) {
    				set_style(div1, "width", /*$tweenedScore*/ ctx[11] + "%");
    			}

    			if (/*wordHelp*/ ctx[8] == true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*wordHelp*/ 256) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div3, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty[0] & /*currentWord*/ 1024) && t4_value !== (t4_value = /*currentWord*/ ctx[10].french + "")) set_data_dev(t4, t4_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div5, t6);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div5, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let notEnoughCharacters;
    	let wordHelp;
    	let currentWord;
    	let translatedCurrentWord;
    	let translatedCurrentWordWithoutMisspeling;
    	let $selectedGermanWords;
    	let $tweenedScore;
    	validate_store(selectedGermanWords, 'selectedGermanWords');
    	component_subscribe($$self, selectedGermanWords, $$value => $$invalidate(21, $selectedGermanWords = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GermanCourse', slots, []);
    	const dispatch = createEventDispatcher();
    	let score = 0;
    	let scorePercentage = 0;
    	let color = 'duolingo-button-green';
    	let lessonEnd = false;
    	let readOnly = false;
    	let wrongAnswer = false;
    	let continueBtn = false;
    	const totalWords = $selectedGermanWords.length;
    	let margin1 = 80;
    	let margin2 = 75;
    	let margin3 = 100;
    	let width = screen.width;
    	let height = screen.height;
    	let background = "#f8f8f8";
    	const tweenedScore = tweened(0);
    	validate_store(tweenedScore, 'tweenedScore');
    	component_subscribe($$self, tweenedScore, value => $$invalidate(11, $tweenedScore = value));

    	onMount(() => {
    		updateCurrentWord();

    		return () => {
    			
    		};
    	});

    	const pressEnterInTextarea = e => {
    		if (e.keyCode === 13 || e.which === 13) {
    			e.preventDefault();
    			return false;
    		}
    	};

    	const pressEnter = e => {
    		switch (e.key) {
    			case "Enter":
    				submitWord();
    		}
    	};

    	const updateCurrentWord = () => {
    		$$invalidate(10, currentWord = $selectedGermanWords[Math.floor(Math.random() * $selectedGermanWords.length)]);
    	};

    	const submitWord = () => {
    		if (translatedCurrentWordWithoutMisspeling.length < 1) {
    			$$invalidate(9, notEnoughCharacters = true);
    		} else if (continueBtn == true) {
    			if (lessonEnd == false) {
    				continueBtn = false;
    				$$invalidate(1, color = 'duolingo-button-green');
    				$$invalidate(9, notEnoughCharacters = false);
    				$$invalidate(7, background = "#f8f8f8");
    				$$invalidate(0, translatedCurrentWord = "");
    				$$invalidate(2, readOnly = false);
    				$$invalidate(3, wrongAnswer = false);
    				updateCurrentWord();
    			} else if (lessonEnd == true) {
    				$$invalidate(17, score = 0);
    				$$invalidate(18, scorePercentage = 0);
    				$$invalidate(1, color = 'duolingo-button-green');
    				$$invalidate(19, lessonEnd = false);
    				$$invalidate(2, readOnly = false);
    				$$invalidate(3, wrongAnswer = false);
    				$$invalidate(9, notEnoughCharacters = false);
    				continueBtn = false;
    				$$invalidate(8, wordHelp = false);
    				dispatch('returnToLobby');
    			}
    		} else if (translatedCurrentWordWithoutMisspeling == currentWord.german.toLowerCase().split(" ").join("")) {
    			selectedGermanWords.update(selectedWords => {
    				// Remove the word from the array
    				return selectedWords.filter(word => word.id !== currentWord.id);
    			});

    			$$invalidate(17, score++, score);
    			$$invalidate(7, background = "#d7ffb8");
    			$$invalidate(1, color = 'duolingo-button-green');
    			$$invalidate(9, notEnoughCharacters = false);
    			continueBtn = true;
    			$$invalidate(2, readOnly = true);

    			if ($selectedGermanWords.length == 0) {
    				$$invalidate(19, lessonEnd = true);
    			}
    		} else {
    			$$invalidate(7, background = "#ffb2b2");
    			$$invalidate(9, notEnoughCharacters = false);
    			$$invalidate(1, color = 'duolingo-button-red');
    			continueBtn = true;
    			$$invalidate(2, readOnly = true);
    			$$invalidate(3, wrongAnswer = true);
    		}
    	};

    	const wordHelpClick = () => {
    		$$invalidate(8, wordHelp = !wordHelp);
    	};

    	onDestroy(() => {
    		
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<GermanCourse> was created with unknown prop '${key}'`);
    	});

    	const keypress_handler = e => pressEnter(e);
    	const click_handler = () => wordHelpClick();

    	function textarea_input_handler() {
    		translatedCurrentWord = this.value;
    		$$invalidate(0, translatedCurrentWord);
    	}

    	const keypress_handler_1 = e => pressEnterInTextarea(e);

    	function textarea_input_handler_1() {
    		translatedCurrentWord = this.value;
    		$$invalidate(0, translatedCurrentWord);
    	}

    	const keypress_handler_2 = e => pressEnterInTextarea(e);
    	const click_handler_1 = () => submitWord();
    	const click_handler_2 = () => submitWord();
    	const click_handler_3 = () => submitWord();
    	const click_handler_4 = () => submitWord();

    	$$self.$capture_state = () => ({
    		tweened,
    		fade,
    		slide,
    		scale,
    		onMount,
    		onDestroy,
    		Button,
    		selectedGermanWords,
    		createEventDispatcher,
    		dispatch,
    		score,
    		scorePercentage,
    		color,
    		lessonEnd,
    		readOnly,
    		wrongAnswer,
    		continueBtn,
    		totalWords,
    		margin1,
    		margin2,
    		margin3,
    		width,
    		height,
    		background,
    		tweenedScore,
    		pressEnterInTextarea,
    		pressEnter,
    		updateCurrentWord,
    		submitWord,
    		wordHelpClick,
    		wordHelp,
    		notEnoughCharacters,
    		currentWord,
    		translatedCurrentWordWithoutMisspeling,
    		translatedCurrentWord,
    		$selectedGermanWords,
    		$tweenedScore
    	});

    	$$self.$inject_state = $$props => {
    		if ('score' in $$props) $$invalidate(17, score = $$props.score);
    		if ('scorePercentage' in $$props) $$invalidate(18, scorePercentage = $$props.scorePercentage);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('lessonEnd' in $$props) $$invalidate(19, lessonEnd = $$props.lessonEnd);
    		if ('readOnly' in $$props) $$invalidate(2, readOnly = $$props.readOnly);
    		if ('wrongAnswer' in $$props) $$invalidate(3, wrongAnswer = $$props.wrongAnswer);
    		if ('continueBtn' in $$props) continueBtn = $$props.continueBtn;
    		if ('margin1' in $$props) $$invalidate(4, margin1 = $$props.margin1);
    		if ('margin2' in $$props) $$invalidate(5, margin2 = $$props.margin2);
    		if ('margin3' in $$props) $$invalidate(6, margin3 = $$props.margin3);
    		if ('width' in $$props) $$invalidate(35, width = $$props.width);
    		if ('height' in $$props) $$invalidate(36, height = $$props.height);
    		if ('background' in $$props) $$invalidate(7, background = $$props.background);
    		if ('wordHelp' in $$props) $$invalidate(8, wordHelp = $$props.wordHelp);
    		if ('notEnoughCharacters' in $$props) $$invalidate(9, notEnoughCharacters = $$props.notEnoughCharacters);
    		if ('currentWord' in $$props) $$invalidate(10, currentWord = $$props.currentWord);
    		if ('translatedCurrentWordWithoutMisspeling' in $$props) $$invalidate(20, translatedCurrentWordWithoutMisspeling = $$props.translatedCurrentWordWithoutMisspeling);
    		if ('translatedCurrentWord' in $$props) $$invalidate(0, translatedCurrentWord = $$props.translatedCurrentWord);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*translatedCurrentWord*/ 1) {
    			$$invalidate(20, translatedCurrentWordWithoutMisspeling = translatedCurrentWord.toLowerCase().split(" ").join(""));
    		}

    		if ($$self.$$.dirty[0] & /*translatedCurrentWordWithoutMisspeling*/ 1048576) {
    			if (translatedCurrentWordWithoutMisspeling.length >= 1) {
    				$$invalidate(9, notEnoughCharacters = false);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*score*/ 131072) {
    			$$invalidate(18, scorePercentage = score / totalWords * 100);
    		}

    		if ($$self.$$.dirty[0] & /*scorePercentage*/ 262144) {
    			tweenedScore.set(scorePercentage);
    		}

    		if ($$self.$$.dirty[0] & /*scorePercentage, score, $selectedGermanWords, lessonEnd*/ 3014656) {
    			console.log(scorePercentage, score, $selectedGermanWords, lessonEnd);
    		}
    	};

    	$$invalidate(9, notEnoughCharacters = false);
    	$$invalidate(8, wordHelp = false);

    	if (width < 1200 && height < 2550) {
    		$$invalidate(4, margin1 = 50);
    		$$invalidate(5, margin2 = 50);
    		$$invalidate(6, margin3 = 50);
    	} else {
    		$$invalidate(4, margin1 = 80);
    	}

    	$$invalidate(10, currentWord = "");
    	$$invalidate(0, translatedCurrentWord = "");

    	return [
    		translatedCurrentWord,
    		color,
    		readOnly,
    		wrongAnswer,
    		margin1,
    		margin2,
    		margin3,
    		background,
    		wordHelp,
    		notEnoughCharacters,
    		currentWord,
    		$tweenedScore,
    		tweenedScore,
    		pressEnterInTextarea,
    		pressEnter,
    		submitWord,
    		wordHelpClick,
    		score,
    		scorePercentage,
    		lessonEnd,
    		translatedCurrentWordWithoutMisspeling,
    		$selectedGermanWords,
    		keypress_handler,
    		click_handler,
    		textarea_input_handler,
    		keypress_handler_1,
    		textarea_input_handler_1,
    		keypress_handler_2,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class GermanCourse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GermanCourse",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\EnglishWords.svelte generated by Svelte v3.59.2 */

    const file$4 = "src\\components\\EnglishWords.svelte";

    function create_fragment$4(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Pas encore dispo, force";
    			add_location(h1, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EnglishWords', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EnglishWords> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class EnglishWords extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EnglishWords",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\EnglishCourse.svelte generated by Svelte v3.59.2 */

    const file$3 = "src\\components\\EnglishCourse.svelte";

    function create_fragment$3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "frr si c pas dispo tu pensais quoi ?";
    			add_location(h1, file$3, 4, 0, 25);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EnglishCourse', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EnglishCourse> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class EnglishCourse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EnglishCourse",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Menu.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\components\\Menu.svelte";

    function create_fragment$2(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let label0;
    	let button0;
    	let t0;
    	let ion_icon0;
    	let t1;
    	let div2;
    	let label1;
    	let button1;
    	let t2;
    	let ion_icon1;
    	let t3;
    	let p;
    	let t5;
    	let script0;
    	let script0_src_value;
    	let t6;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let t7;
    	let script3;
    	let script3_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			button0 = element("button");
    			t0 = space();
    			ion_icon0 = element("ion-icon");
    			t1 = space();
    			div2 = element("div");
    			label1 = element("label");
    			button1 = element("button");
    			t2 = space();
    			ion_icon1 = element("ion-icon");
    			t3 = space();
    			p = element("p");
    			p.textContent = "changer mode sombre/clair";
    			t5 = space();
    			script0 = element("script");
    			t6 = space();
    			script1 = element("script");
    			script2 = element("script");
    			t7 = space();
    			script3 = element("script");
    			attr_dev(button0, "class", "svelte-1ctd5r8");
    			add_location(button0, file$2, 17, 8, 376);
    			set_custom_element_data(ion_icon0, "name", "close-outline");
    			set_custom_element_data(ion_icon0, "class", "close-menu-image svelte-1ctd5r8");
    			add_location(ion_icon0, file$2, 18, 8, 434);
    			attr_dev(label0, "class", "svelte-1ctd5r8");
    			add_location(label0, file$2, 16, 6, 359);
    			attr_dev(div0, "class", "close-page");
    			add_location(div0, file$2, 15, 4, 327);
    			attr_dev(div1, "class", "close-menu svelte-1ctd5r8");
    			add_location(div1, file$2, 14, 2, 297);
    			attr_dev(button1, "class", "svelte-1ctd5r8");
    			add_location(button1, file$2, 25, 6, 715);
    			set_custom_element_data(ion_icon1, "name", "contrast-outline");
    			set_custom_element_data(ion_icon1, "class", "change-background-image svelte-1ctd5r8");
    			add_location(ion_icon1, file$2, 26, 6, 740);
    			attr_dev(label1, "class", "svelte-1ctd5r8");
    			add_location(label1, file$2, 24, 4, 653);
    			attr_dev(p, "class", "svelte-1ctd5r8");
    			add_location(p, file$2, 28, 4, 837);
    			attr_dev(div2, "class", "open-change-color-background svelte-1ctd5r8");
    			add_location(div2, file$2, 22, 2, 543);
    			attr_dev(script0, "type", "module");
    			if (!src_url_equal(script0.src, script0_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$2, 30, 2, 883);
    			script1.noModule = true;
    			if (!src_url_equal(script1.src, script1_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$2, 31, 2, 987);
    			attr_dev(script2, "type", "module");
    			if (!src_url_equal(script2.src, script2_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$2, 31, 93, 1078);
    			script3.noModule = true;
    			if (!src_url_equal(script3.src, script3_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$2, 32, 2, 1182);
    			attr_dev(div3, "class", "menu svelte-1ctd5r8");
    			add_location(div3, file$2, 13, 0, 275);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(label0, button0);
    			append_dev(label0, t0);
    			append_dev(label0, ion_icon0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(label1, button1);
    			append_dev(label1, t2);
    			append_dev(label1, ion_icon1);
    			append_dev(div2, t3);
    			append_dev(div2, p);
    			append_dev(div3, t5);
    			append_dev(div3, script0);
    			append_dev(div3, t6);
    			append_dev(div3, script1);
    			append_dev(div3, script2);
    			append_dev(div3, t7);
    			append_dev(div3, script3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false, false),
    					listen_dev(label1, "click", /*click_handler_1*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	const dispatch = createEventDispatcher();

    	const openChangeBackgroundColor = () => {
    		dispatch('openChangeBackgroundColor');
    	};

    	const closeMenu = () => {
    		dispatch('closeMenu');
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		closeMenu();
    	};

    	const click_handler_1 = () => {
    		openChangeBackgroundColor();
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		openChangeBackgroundColor,
    		closeMenu
    	});

    	return [openChangeBackgroundColor, closeMenu, click_handler, click_handler_1];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\shared\DarkLightMode.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\shared\\DarkLightMode.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let t0;
    	let label;
    	let input;
    	let t1;
    	let ion_icon0;
    	let t2;
    	let ion_icon1;
    	let t3;
    	let span0;
    	let t4;
    	let span1;
    	let t5;
    	let script0;
    	let script0_src_value;
    	let t6;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let t7;
    	let script3;
    	let script3_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			label = element("label");
    			input = element("input");
    			t1 = space();
    			ion_icon0 = element("ion-icon");
    			t2 = space();
    			ion_icon1 = element("ion-icon");
    			t3 = space();
    			span0 = element("span");
    			t4 = space();
    			span1 = element("span");
    			t5 = space();
    			script0 = element("script");
    			t6 = space();
    			script1 = element("script");
    			script2 = element("script");
    			t7 = space();
    			script3 = element("script");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "toggle-change-light-dark-mode svelte-21z3tx");
    			add_location(input, file$1, 15, 4, 350);
    			set_custom_element_data(ion_icon0, "name", "sunny");
    			set_custom_element_data(ion_icon0, "class", "sun svelte-21z3tx");
    			add_location(ion_icon0, file$1, 16, 4, 452);
    			set_custom_element_data(ion_icon1, "name", "moon");
    			set_custom_element_data(ion_icon1, "class", "moon svelte-21z3tx");
    			add_location(ion_icon1, file$1, 17, 4, 504);
    			attr_dev(span0, "class", "toggle svelte-21z3tx");
    			add_location(span0, file$1, 18, 4, 556);
    			attr_dev(span1, "class", "animateBg svelte-21z3tx");
    			add_location(span1, file$1, 19, 4, 590);
    			attr_dev(label, "class", "change-light-dark-mode svelte-21z3tx");
    			add_location(label, file$1, 14, 2, 306);
    			attr_dev(script0, "type", "module");
    			if (!src_url_equal(script0.src, script0_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$1, 21, 2, 637);
    			script1.noModule = true;
    			if (!src_url_equal(script1.src, script1_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$1, 22, 2, 741);
    			attr_dev(script2, "type", "module");
    			if (!src_url_equal(script2.src, script2_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file$1, 22, 93, 832);
    			script3.noModule = true;
    			if (!src_url_equal(script3.src, script3_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file$1, 23, 2, 936);
    			attr_dev(div, "class", "dark-light-mode svelte-21z3tx");
    			add_location(div, file$1, 11, 0, 196);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, input);
    			append_dev(label, t1);
    			append_dev(label, ion_icon0);
    			append_dev(label, t2);
    			append_dev(label, ion_icon1);
    			append_dev(label, t3);
    			append_dev(label, span0);
    			append_dev(label, t4);
    			append_dev(label, span1);
    			append_dev(div, t5);
    			append_dev(div, script0);
    			append_dev(div, t6);
    			append_dev(div, script1);
    			append_dev(div, script2);
    			append_dev(div, t7);
    			append_dev(div, script3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "click", self(/*click_handler*/ ctx[3]), false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DarkLightMode', slots, ['default']);
    	const dispatch = createEventDispatcher();

    	const changeMode = () => {
    		dispatch('changeLightDarkMode');
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DarkLightMode> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => changeMode();

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		changeMode
    	});

    	return [changeMode, $$scope, slots, click_handler];
    }

    class DarkLightMode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DarkLightMode",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file = "src\\App.svelte";

    // (132:47) 
    function create_if_block_7(ctx) {
    	let englishcourse;
    	let current;
    	englishcourse = new EnglishCourse({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(englishcourse.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(englishcourse, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(englishcourse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(englishcourse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(englishcourse, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(132:47) ",
    		ctx
    	});

    	return block;
    }

    // (130:46) 
    function create_if_block_6(ctx) {
    	let germancourse;
    	let current;
    	germancourse = new GermanCourse({ $$inline: true });
    	germancourse.$on("returnToLobby", /*returnToLobby_handler*/ ctx[25]);

    	const block = {
    		c: function create() {
    			create_component(germancourse.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(germancourse, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(germancourse.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(germancourse.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(germancourse, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(130:46) ",
    		ctx
    	});

    	return block;
    }

    // (128:44) 
    function create_if_block_5(ctx) {
    	let menu_1;
    	let current;
    	menu_1 = new Menu({ $$inline: true });
    	menu_1.$on("closeMenu", /*closeMenu_handler*/ ctx[23]);
    	menu_1.$on("openChangeBackgroundColor", /*openChangeBackgroundColor_handler*/ ctx[24]);

    	const block = {
    		c: function create() {
    			create_component(menu_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(128:44) ",
    		ctx
    	});

    	return block;
    }

    // (116:57) 
    function create_if_block_4(ctx) {
    	let darklightmode;
    	let current;

    	darklightmode = new DarkLightMode({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	darklightmode.$on("changeLightDarkMode", /*changeLightDarkMode_handler*/ ctx[22]);

    	const block = {
    		c: function create() {
    			create_component(darklightmode.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(darklightmode, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const darklightmode_changes = {};

    			if (dirty & /*$$scope, colorCloseBackgroundColorPage*/ 268435488) {
    				darklightmode_changes.$$scope = { dirty, ctx };
    			}

    			darklightmode.$set(darklightmode_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(darklightmode.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(darklightmode.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(darklightmode, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(116:57) ",
    		ctx
    	});

    	return block;
    }

    // (88:2) {#if course == false && darkLightModeMenu == false && menu == false}
    function create_if_block(ctx) {
    	let div0;
    	let h1;
    	let t1;
    	let div1;
    	let label;
    	let button0;
    	let t2;
    	let img;
    	let img_src_value;
    	let t3;
    	let div2;
    	let h3;
    	let t5;
    	let select;
    	let option0;
    	let option1;
    	let t8;
    	let div3;
    	let current_block_type_index;
    	let if_block0;
    	let t9;
    	let button1;
    	let t10;
    	let if_block1_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*language*/ ctx[1] === "german") return 0;
    		if (/*language*/ ctx[1] === "english") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	button1 = new Button({
    			props: {
    				margin: "45px 0",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[20]);
    	let if_block1 = /*notEnoughSelectedWords*/ ctx[3] == true && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Bienvenue";
    			t1 = space();
    			div1 = element("div");
    			label = element("label");
    			button0 = element("button");
    			t2 = space();
    			img = element("img");
    			t3 = space();
    			div2 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Langue";
    			t5 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Allemand";
    			option1 = element("option");
    			option1.textContent = "Anglais";
    			t8 = space();
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t9 = space();
    			create_component(button1.$$.fragment);
    			t10 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(h1, "class", "svelte-utwoyx");
    			add_location(h1, file, 89, 4, 2190);
    			attr_dev(div0, "class", "top-page svelte-utwoyx");
    			add_location(div0, file, 88, 3, 2163);
    			attr_dev(button0, "class", "svelte-utwoyx");
    			add_location(button0, file, 93, 5, 2264);
    			if (!src_url_equal(img.src, img_src_value = "/img/parameter.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file, 94, 5, 2317);
    			attr_dev(label, "class", "svelte-utwoyx");
    			add_location(label, file, 92, 4, 2251);
    			attr_dev(div1, "class", "parameters svelte-utwoyx");
    			add_location(div1, file, 91, 3, 2222);
    			add_location(h3, file, 98, 4, 2415);
    			option0.__value = "german";
    			option0.value = option0.__value;
    			add_location(option0, file, 100, 5, 2471);
    			option1.__value = "english";
    			option1.value = option1.__value;
    			add_location(option1, file, 101, 5, 2517);
    			if (/*language*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[19].call(select));
    			add_location(select, file, 99, 4, 2435);
    			attr_dev(div2, "class", "select-language svelte-utwoyx");
    			add_location(div2, file, 97, 3, 2381);
    			attr_dev(div3, "class", "wordsChoice");
    			add_location(div3, file, 104, 3, 2585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(label, button0);
    			append_dev(label, t2);
    			append_dev(label, img);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h3);
    			append_dev(div2, t5);
    			append_dev(div2, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*language*/ ctx[1], true);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div3, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div3, null);
    			}

    			insert_dev(target, t9, anchor);
    			mount_component(button1, target, anchor);
    			insert_dev(target, t10, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[18], false, false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[19])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*language*/ 2) {
    				select_option(select, /*language*/ ctx[1]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block0) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block0 = if_blocks[current_block_type_index];

    					if (!if_block0) {
    						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block0.c();
    					}

    					transition_in(if_block0, 1);
    					if_block0.m(div3, null);
    				} else {
    					if_block0 = null;
    				}
    			}

    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 268435456) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (/*notEnoughSelectedWords*/ ctx[3] == true) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div3);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t9);
    			destroy_component(button1, detaching);
    			if (detaching) detach_dev(t10);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(88:2) {#if course == false && darkLightModeMenu == false && menu == false}",
    		ctx
    	});

    	return block;
    }

    // (117:3) <DarkLightMode on:changeLightDarkMode={() => changeCurrentBackgroundColorMode()}>
    function create_default_slot_1(ctx) {
    	let div;
    	let label;
    	let button;
    	let t0;
    	let ion_icon;
    	let t1;
    	let script0;
    	let script0_src_value;
    	let t2;
    	let script1;
    	let script1_src_value;
    	let script2;
    	let script2_src_value;
    	let t3;
    	let script3;
    	let script3_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			button = element("button");
    			t0 = space();
    			ion_icon = element("ion-icon");
    			t1 = space();
    			script0 = element("script");
    			t2 = space();
    			script1 = element("script");
    			script2 = element("script");
    			t3 = space();
    			script3 = element("script");
    			attr_dev(button, "class", "svelte-utwoyx");
    			add_location(button, file, 119, 6, 3133);
    			set_custom_element_data(ion_icon, "name", "close-outline");
    			set_custom_element_data(ion_icon, "class", "close-page-image svelte-utwoyx");
    			set_style(ion_icon, "color", /*colorCloseBackgroundColorPage*/ ctx[5]);
    			add_location(ion_icon, file, 120, 6, 3204);
    			attr_dev(label, "class", "svelte-utwoyx");
    			add_location(label, file, 118, 5, 3119);
    			attr_dev(script0, "type", "module");
    			if (!src_url_equal(script0.src, script0_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file, 122, 5, 3339);
    			script1.noModule = true;
    			if (!src_url_equal(script1.src, script1_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file, 123, 6, 3446);
    			attr_dev(script2, "type", "module");
    			if (!src_url_equal(script2.src, script2_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file, 123, 97, 3537);
    			script3.noModule = true;
    			if (!src_url_equal(script3.src, script3_src_value = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js")) attr_dev(script3, "src", script3_src_value);
    			add_location(script3, file, 124, 6, 3644);
    			attr_dev(div, "class", "close-page svelte-utwoyx");
    			add_location(div, file, 117, 4, 3089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, button);
    			append_dev(label, t0);
    			append_dev(label, ion_icon);
    			append_dev(div, t1);
    			append_dev(div, script0);
    			append_dev(div, t2);
    			append_dev(div, script1);
    			append_dev(div, script2);
    			append_dev(div, t3);
    			append_dev(div, script3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[21], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*colorCloseBackgroundColorPage*/ 32) {
    				set_style(ion_icon, "color", /*colorCloseBackgroundColorPage*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(117:3) <DarkLightMode on:changeLightDarkMode={() => changeCurrentBackgroundColorMode()}>",
    		ctx
    	});

    	return block;
    }

    // (108:37) 
    function create_if_block_3(ctx) {
    	let englishwords;
    	let current;
    	englishwords = new EnglishWords({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(englishwords.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(englishwords, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(englishwords.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(englishwords.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(englishwords, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(108:37) ",
    		ctx
    	});

    	return block;
    }

    // (106:4) {#if language === "german"}
    function create_if_block_2(ctx) {
    	let germanwords;
    	let current;
    	germanwords = new GermanWords({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(germanwords.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(germanwords, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(germanwords.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(germanwords.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(germanwords, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(106:4) {#if language === \\\"german\\\"}",
    		ctx
    	});

    	return block;
    }

    // (112:3) <Button margin="45px 0" on:click={() => startCourse()}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Commencer");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(112:3) <Button margin=\\\"45px 0\\\" on:click={() => startCourse()}>",
    		ctx
    	});

    	return block;
    }

    // (113:3) {#if notEnoughSelectedWords == true}
    function create_if_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "selectionez au moins 1 mot";
    			attr_dev(p, "class", "not-enough-selected-words svelte-utwoyx");
    			add_location(p, file, 113, 4, 2865);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(113:3) {#if notEnoughSelectedWords == true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*course*/ ctx[7] == false && /*darkLightModeMenu*/ ctx[0] == false && /*menu*/ ctx[4] == false) return 0;
    		if (/*darkLightModeMenu*/ ctx[0] == true && /*course*/ ctx[7] == false) return 1;
    		if (/*menu*/ ctx[4] == true && /*course*/ ctx[7] == false) return 2;
    		if (/*languageCourse*/ ctx[2] === "germanCourse") return 3;
    		if (/*languageCourse*/ ctx[2] === "englishCourse") return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "sub-main svelte-utwoyx");
    			add_location(div, file, 86, 1, 2066);
    			set_style(main, "background", /*background*/ ctx[6]);
    			attr_dev(main, "class", "svelte-utwoyx");
    			add_location(main, file, 85, 0, 2024);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keypress", /*keypress_handler*/ ctx[17], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}

    			if (!current || dirty & /*background*/ 64) {
    				set_style(main, "background", /*background*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let course;
    	let background;
    	let $selectedGermanWords;
    	validate_store(selectedGermanWords, 'selectedGermanWords');
    	component_subscribe($$self, selectedGermanWords, $$value => $$invalidate(16, $selectedGermanWords = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let language = "german";
    	const delay = ms => new Promise(res => setTimeout(res, ms));
    	let languageCourse = "germanCourse";
    	let notEnoughSelectedWords = false;
    	let menu = false;
    	let darkMode = false;
    	let darkLightModeMenu = false;
    	let colorCloseBackgroundColorPage = "#2b2b2b";

    	const startCourse = () => {
    		if ($selectedGermanWords == 0) {
    			$$invalidate(3, notEnoughSelectedWords = true);
    		} else {
    			if (language == "german") {
    				$$invalidate(2, languageCourse = "germanCourse");
    				$$invalidate(7, course = true);
    			} else {
    				$$invalidate(2, languageCourse = "englishCourse");
    				$$invalidate(7, course = true);
    			}
    		}
    	};

    	const pressEnter = e => {
    		switch (e.key) {
    			case "Enter":
    				startCourse();
    		}
    	};

    	const returnToLobby = () => {
    		$$invalidate(7, course = false);
    	};

    	const changeCurrentBackgroundColorMode = async () => {
    		if (darkMode == true) {
    			darkMode = !darkMode;
    			$$invalidate(5, colorCloseBackgroundColorPage = "#2b2b2b");
    			await delay(1500);
    			$$invalidate(6, background = "#f8f8f8");
    		} else {
    			darkMode = !darkMode;
    			$$invalidate(5, colorCloseBackgroundColorPage = "#f8f8f8");
    			$$invalidate(6, background = "#2b2b2b");
    		}
    	};

    	const openChangeBackgroundColor = () => {
    		$$invalidate(0, darkLightModeMenu = true);
    		$$invalidate(4, menu = false);
    	};

    	const closeChangeBackgroundPage = () => {
    		$$invalidate(0, darkLightModeMenu = false);
    		$$invalidate(4, menu = true);
    	};

    	const openMenu = () => {
    		$$invalidate(4, menu = true);
    	};

    	const closeMenu = () => {
    		$$invalidate(4, menu = false);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const keypress_handler = e => pressEnter(e);

    	const click_handler = () => {
    		openMenu();
    	};

    	function select_change_handler() {
    		language = select_value(this);
    		$$invalidate(1, language);
    	}

    	const click_handler_1 = () => startCourse();

    	const click_handler_2 = () => {
    		closeChangeBackgroundPage();
    	};

    	const changeLightDarkMode_handler = () => changeCurrentBackgroundColorMode();
    	const closeMenu_handler = () => closeMenu();
    	const openChangeBackgroundColor_handler = () => openChangeBackgroundColor();
    	const returnToLobby_handler = () => returnToLobby();

    	$$self.$capture_state = () => ({
    		GermanWords,
    		GermanCourse,
    		EnglishWords,
    		EnglishCourse,
    		selectedGermanWords,
    		Menu,
    		Button,
    		DarkLightMode,
    		language,
    		delay,
    		languageCourse,
    		notEnoughSelectedWords,
    		menu,
    		darkMode,
    		darkLightModeMenu,
    		colorCloseBackgroundColorPage,
    		startCourse,
    		pressEnter,
    		returnToLobby,
    		changeCurrentBackgroundColorMode,
    		openChangeBackgroundColor,
    		closeChangeBackgroundPage,
    		openMenu,
    		closeMenu,
    		background,
    		course,
    		$selectedGermanWords
    	});

    	$$self.$inject_state = $$props => {
    		if ('language' in $$props) $$invalidate(1, language = $$props.language);
    		if ('languageCourse' in $$props) $$invalidate(2, languageCourse = $$props.languageCourse);
    		if ('notEnoughSelectedWords' in $$props) $$invalidate(3, notEnoughSelectedWords = $$props.notEnoughSelectedWords);
    		if ('menu' in $$props) $$invalidate(4, menu = $$props.menu);
    		if ('darkMode' in $$props) darkMode = $$props.darkMode;
    		if ('darkLightModeMenu' in $$props) $$invalidate(0, darkLightModeMenu = $$props.darkLightModeMenu);
    		if ('colorCloseBackgroundColorPage' in $$props) $$invalidate(5, colorCloseBackgroundColorPage = $$props.colorCloseBackgroundColorPage);
    		if ('background' in $$props) $$invalidate(6, background = $$props.background);
    		if ('course' in $$props) $$invalidate(7, course = $$props.course);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedGermanWords*/ 65536) {
    			if ($selectedGermanWords.length > 0) {
    				$$invalidate(3, notEnoughSelectedWords = false);
    			}
    		}

    		if ($$self.$$.dirty & /*darkLightModeMenu*/ 1) {
    			if (darkLightModeMenu == true) {
    				$$invalidate(6, background = "#2b2b2b");
    			} else {
    				$$invalidate(6, background = "#f8f8f8");
    			}
    		}
    	};

    	$$invalidate(7, course = false);
    	$$invalidate(6, background = "#f8f8f8");

    	return [
    		darkLightModeMenu,
    		language,
    		languageCourse,
    		notEnoughSelectedWords,
    		menu,
    		colorCloseBackgroundColorPage,
    		background,
    		course,
    		startCourse,
    		pressEnter,
    		returnToLobby,
    		changeCurrentBackgroundColorMode,
    		openChangeBackgroundColor,
    		closeChangeBackgroundPage,
    		openMenu,
    		closeMenu,
    		$selectedGermanWords,
    		keypress_handler,
    		click_handler,
    		select_change_handler,
    		click_handler_1,
    		click_handler_2,
    		changeLightDarkMode_handler,
    		closeMenu_handler,
    		openChangeBackgroundColor_handler,
    		returnToLobby_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
