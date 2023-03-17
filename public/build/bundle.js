
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
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
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

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
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
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
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
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
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
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
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
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
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
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
            ctx: null,
            // state
            props,
            update: noop$1,
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
            this.$destroy = noop$1;
        }
        $on(type, callback) {
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
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
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.50.1 */

    function create_fragment$K(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$u, create_fragment$K, safe_not_equal, { basepath: 3, url: 4 });
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.50.1 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (43:2) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return { props: switch_instance_props };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	return {
    		c() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    function create_fragment$J(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$6(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$t, create_fragment$J, safe_not_equal, { path: 8, component: 0 });
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.50.1 */

    function create_fragment$I(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	return {
    		c() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen(a, "click", /*onClick*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$s, create_fragment$I, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    var _ = {
      $(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector;
      },
      extend(...args) {
        return Object.assign(...args);
      },
      cumulativeOffset(element) {
        let top = 0;
        let left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        return {
          top: top,
          left: left
        };
      },
      directScroll(element) {
        return element && element !== document && element !== document.body;
      },
      scrollTop(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollTop = value) : element.scrollTop;
        } else {
          return inSetter
            ? (document.documentElement.scrollTop = document.body.scrollTop = value)
            : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
        }
      },
      scrollLeft(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollLeft = value) : element.scrollLeft;
        } else {
          return inSetter
            ? (document.documentElement.scrollLeft = document.body.scrollLeft = value)
            : window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0;
        }
      }
    };

    const defaultOptions = {
      container: "body",
      duration: 500,
      delay: 0,
      offset: 0,
      easing: cubicInOut,
      onStart: noop$1,
      onDone: noop$1,
      onAborting: noop$1,
      scrollX: false,
      scrollY: true
    };

    const _scrollTo = options => {
      let {
        offset,
        duration,
        delay,
        easing,
        x=0,
        y=0,
        scrollX,
        scrollY,
        onStart,
        onDone,
        container,
        onAborting,
        element
      } = options;

      if (typeof offset === "function") {
        offset = offset();
      }

      var cumulativeOffsetContainer = _.cumulativeOffset(container);
      var cumulativeOffsetTarget = element
        ? _.cumulativeOffset(element)
        : { top: y, left: x };

      var initialX = _.scrollLeft(container);
      var initialY = _.scrollTop(container);

      var targetX =
        cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
      var targetY =
        cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

      var diffX = targetX - initialX;
    	var diffY = targetY - initialY;

      let scrolling = true;
      let started = false;
      let start_time = now() + delay;
      let end_time = start_time + duration;

      function scrollToTopLeft(element, top, left) {
        if (scrollX) _.scrollLeft(element, left);
        if (scrollY) _.scrollTop(element, top);
      }

      function start(delayStart) {
        if (!delayStart) {
          started = true;
          onStart(element, {x, y});
        }
      }

      function tick(progress) {
        scrollToTopLeft(
          container,
          initialY + diffY * progress,
          initialX + diffX * progress
        );
      }

      function stop() {
        scrolling = false;
      }

      loop(now => {
        if (!started && now >= start_time) {
          start(false);
        }

        if (started && now >= end_time) {
          tick(1);
          stop();
          onDone(element, {x, y});
        }

        if (!scrolling) {
          onAborting(element, {x, y});
          return false;
        }
        if (started) {
          const p = now - start_time;
          const t = 0 + 1 * easing(p / duration);
          tick(t);
        }

        return true;
      });

      start(delay);

      tick(0);

      return stop;
    };

    const proceedOptions = options => {
    	let opts = _.extend({}, defaultOptions, options);
      opts.container = _.$(opts.container);
      opts.element = _.$(opts.element);
      return opts;
    };

    const scrollTo = options => {
      return _scrollTo(proceedOptions(options));
    };

    const makeScrollToAction = scrollToFunc => {
      return (node, options) => {
        let current = options;
        const handle = e => {
          e.preventDefault();
          scrollToFunc(
            typeof current === "string" ? { element: current } : current
          );
        };
        node.addEventListener("click", handle);
        node.addEventListener("touchstart", handle);
        return {
          update(options) {
            current = options;
          },
          destroy() {
            node.removeEventListener("click", handle);
            node.removeEventListener("touchstart", handle);
          }
        };
      };
    };

    const scrollto = makeScrollToAction(scrollTo);

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    function getOriginalBodyPadding() {
      const style = window ? window.getComputedStyle(document.body, null) : {};

      return parseInt((style && style.getPropertyValue('padding-right')) || 0, 10);
    }

    function getScrollbarWidth() {
      let scrollDiv = document.createElement('div');
      // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    function setScrollbarWidth(padding) {
      document.body.style.paddingRight = padding > 0 ? `${padding}px` : null;
    }

    function isBodyOverflowing() {
      return window ? document.body.clientWidth < window.innerWidth : false;
    }

    function isObject(value) {
      const type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    function conditionallyUpdateScrollbar() {
      const scrollbarWidth = getScrollbarWidth();
      // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433
      const fixedContent = document.querySelectorAll(
        '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
      )[0];
      const bodyPadding = fixedContent
        ? parseInt(fixedContent.style.paddingRight || 0, 10)
        : 0;

      if (isBodyOverflowing()) {
        setScrollbarWidth(bodyPadding + scrollbarWidth);
      }
    }

    function getColumnSizeClass(isXs, colWidth, colSize) {
      if (colSize === true || colSize === '') {
        return isXs ? 'col' : `col-${colWidth}`;
      } else if (colSize === 'auto') {
        return isXs ? 'col-auto' : `col-${colWidth}-auto`;
      }

      return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
    }

    function browserEvent(target, ...args) {
      target.addEventListener(...args);

      return () => target.removeEventListener(...args);
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    /* node_modules/sveltestrap/src/Button.svelte generated by Svelte v3.50.1 */

    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	return {
    		c() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = listen(button, "click", /*click_handler_1*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*close, children, $$scope*/ 65539)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (33:0) {#if href}
    function create_if_block$5(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	return {
    		c() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen(a, "click", /*click_handler*/ ctx[18]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
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
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (62:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (60:25) 
    function create_if_block_3$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (58:6) {#if close}
    function create_if_block_2$2(ctx) {
    	let span;

    	return {
    		c() {
    			span = element("span");
    			span.textContent = "×";
    			attr(span, "aria-hidden", "true");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (57:10)        
    function fallback_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_if_block_3$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*close*/ ctx[1]) return 0;
    		if (/*children*/ ctx[0]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (44:4) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[16],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[16])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[16], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (42:4) {#if children}
    function create_if_block_1$3(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*children*/ ctx[0]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*children*/ 1) set_data(t, /*children*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    function create_fragment$H(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","outline","size","style","value"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { href = '' } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(20, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$new_props) $$invalidate(0, children = $$new_props.children);
    		if ('close' in $$new_props) $$invalidate(1, close = $$new_props.close);
    		if ('color' in $$new_props) $$invalidate(13, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('outline' in $$new_props) $$invalidate(14, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(15, size = $$new_props.size);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('$$scope' in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		$$invalidate(8, ariaLabel = $$props['aria-label']);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active*/ 64514) {
    			$$invalidate(7, classes = classnames(className, { close }, close || 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'btn-block' : false, { active }));
    		}

    		if ($$self.$$.dirty & /*close*/ 2) {
    			$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		children,
    		close,
    		disabled,
    		href,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		color,
    		outline,
    		size,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$r, create_fragment$H, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 0,
    			close: 1,
    			color: 13,
    			disabled: 2,
    			href: 3,
    			outline: 14,
    			size: 15,
    			style: 4,
    			value: 5
    		});
    	}
    }

    /* node_modules/sveltestrap/src/Col.svelte generated by Svelte v3.50.1 */

    function create_fragment$G(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let div_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			class: div_class_value = /*colClasses*/ ctx[0].join(' ')
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				{ class: div_class_value }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$q($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","xs","sm","md","lg","xl"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { xs = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xl = undefined } = $$props;
    	const colClasses = [];
    	const lookup = { xs, sm, md, lg, xl };

    	Object.keys(lookup).forEach(colWidth => {
    		const columnProp = lookup[colWidth];

    		if (!columnProp && columnProp !== '') {
    			return; //no value for this width
    		}

    		const isXs = colWidth === 'xs';

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			if (columnProp.size || columnProp.size === '') {
    				colClasses.push(colClass);
    			}

    			if (columnProp.push) {
    				colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
    			}

    			if (columnProp.pull) {
    				colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
    			}

    			if (columnProp.offset) {
    				colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
    			}
    		} else {
    			colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    		}
    	});

    	if (!colClasses.length) {
    		colClasses.push('col');
    	}

    	if (className) {
    		colClasses.push(className);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('xs' in $$new_props) $$invalidate(3, xs = $$new_props.xs);
    		if ('sm' in $$new_props) $$invalidate(4, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(5, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(6, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(7, xl = $$new_props.xl);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	return [colClasses, $$restProps, className, xs, sm, md, lg, xl, $$scope, slots];
    }

    class Col extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$q, create_fragment$G, safe_not_equal, {
    			class: 2,
    			xs: 3,
    			sm: 4,
    			md: 5,
    			lg: 6,
    			xl: 7
    		});
    	}
    }

    /* node_modules/sveltestrap/src/Container.svelte generated by Svelte v3.50.1 */

    function create_fragment$F(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","fluid"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { fluid = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('fluid' in $$new_props) $$invalidate(3, fluid = $$new_props.fluid);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, fluid*/ 12) {
    			$$invalidate(0, classes = classnames(className, fluid ? 'container-fluid' : 'container'));
    		}
    	};

    	return [classes, $$restProps, className, fluid, $$scope, slots];
    }

    class Container extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$p, create_fragment$F, safe_not_equal, { class: 2, fluid: 3 });
    	}
    }

    /* node_modules/sveltestrap/src/Form.svelte generated by Svelte v3.50.1 */

    function create_fragment$E(ctx) {
    	let form;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	let form_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let form_data = {};

    	for (let i = 0; i < form_levels.length; i += 1) {
    		form_data = assign(form_data, form_levels[i]);
    	}

    	return {
    		c() {
    			form = element("form");
    			if (default_slot) default_slot.c();
    			set_attributes(form, form_data);
    		},
    		m(target, anchor) {
    			insert(target, form, anchor);

    			if (default_slot) {
    				default_slot.m(form, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen(form, "submit", /*submit_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(form, form_data = get_spread_update(form_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(form);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","inline"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { inline = false } = $$props;

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('inline' in $$new_props) $$invalidate(3, inline = $$new_props.inline);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, inline*/ 12) {
    			$$invalidate(0, classes = classnames(className, inline ? 'form-inline' : false));
    		}
    	};

    	return [classes, $$restProps, className, inline, $$scope, slots, submit_handler];
    }

    class Form extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$o, create_fragment$E, safe_not_equal, { class: 2, inline: 3 });
    	}
    }

    /* node_modules/sveltestrap/src/FormGroup.svelte generated by Svelte v3.50.1 */

    function create_else_block$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let div_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (21:0) {#if tag === 'fieldset'}
    function create_if_block$4(ctx) {
    	let fieldset;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let fieldset_levels = [/*$$restProps*/ ctx[2], { class: /*classes*/ ctx[1] }];
    	let fieldset_data = {};

    	for (let i = 0; i < fieldset_levels.length; i += 1) {
    		fieldset_data = assign(fieldset_data, fieldset_levels[i]);
    	}

    	return {
    		c() {
    			fieldset = element("fieldset");
    			if (default_slot) default_slot.c();
    			set_attributes(fieldset, fieldset_data);
    		},
    		m(target, anchor) {
    			insert(target, fieldset, anchor);

    			if (default_slot) {
    				default_slot.m(fieldset, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(fieldset, fieldset_data = get_spread_update(fieldset_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(fieldset);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function create_fragment$D(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[0] === 'fieldset') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","row","check","inline","disabled","tag"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { row = false } = $$props;
    	let { check = false } = $$props;
    	let { inline = false } = $$props;
    	let { disabled = false } = $$props;
    	let { tag = null } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('row' in $$new_props) $$invalidate(4, row = $$new_props.row);
    		if ('check' in $$new_props) $$invalidate(5, check = $$new_props.check);
    		if ('inline' in $$new_props) $$invalidate(6, inline = $$new_props.inline);
    		if ('disabled' in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ('tag' in $$new_props) $$invalidate(0, tag = $$new_props.tag);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, row, check, inline, disabled*/ 248) {
    			$$invalidate(1, classes = classnames(className, row ? 'row' : false, check ? 'form-check' : 'form-group', check && inline ? 'form-check-inline' : false, check && disabled ? 'disabled' : false));
    		}
    	};

    	return [
    		tag,
    		classes,
    		$$restProps,
    		className,
    		row,
    		check,
    		inline,
    		disabled,
    		$$scope,
    		slots
    	];
    }

    class FormGroup extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$n, create_fragment$D, safe_not_equal, {
    			class: 3,
    			row: 4,
    			check: 5,
    			inline: 6,
    			disabled: 7,
    			tag: 0
    		});
    	}
    }

    /* node_modules/sveltestrap/src/Input.svelte generated by Svelte v3.50.1 */

    function create_if_block_16(ctx) {
    	let select;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	let select_levels = [
    		/*$$restProps*/ ctx[12],
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ readonly: /*readonly*/ ctx[4] }
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	return {
    		c() {
    			select = element("select");
    			if (default_slot) default_slot.c();
    			set_attributes(select, select_data);
    			if (/*value*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[152].call(select));
    		},
    		m(target, anchor) {
    			insert(target, select, anchor);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			(select_data.multiple ? select_options : select_option)(select, select_data.value);
    			if (select.autofocus) select.focus();
    			select_option(select, /*value*/ ctx[1]);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(select, "blur", /*blur_handler_16*/ ctx[133]),
    					listen(select, "focus", /*focus_handler_16*/ ctx[134]),
    					listen(select, "change", /*change_handler_15*/ ctx[135]),
    					listen(select, "input", /*input_handler_15*/ ctx[136]),
    					listen(select, "change", /*select_change_handler*/ ctx[152])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 2097152)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(select, select_data = get_spread_update(select_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				(!current || dirty[0] & /*classes*/ 512) && { class: /*classes*/ ctx[9] },
    				(!current || dirty[0] & /*name*/ 64) && { name: /*name*/ ctx[6] },
    				(!current || dirty[0] & /*disabled*/ 256) && { disabled: /*disabled*/ ctx[8] },
    				(!current || dirty[0] & /*readonly*/ 16) && { readonly: /*readonly*/ ctx[4] }
    			]));

    			if (dirty[0] & /*$$restProps, classes, name, disabled, readonly*/ 4944 && 'value' in select_data) (select_data.multiple ? select_options : select_option)(select, select_data.value);

    			if (dirty[0] & /*value*/ 2) {
    				select_option(select, /*value*/ ctx[1]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(select);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (340:29) 
    function create_if_block_15(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		/*$$restProps*/ ctx[12],
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] },
    		{ readOnly: /*readonly*/ ctx[4] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	return {
    		c() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    		},
    		m(target, anchor) {
    			insert(target, textarea, anchor);
    			if (textarea.autofocus) textarea.focus();
    			set_input_value(textarea, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(textarea, "blur", /*blur_handler_15*/ ctx[126]),
    					listen(textarea, "focus", /*focus_handler_15*/ ctx[127]),
    					listen(textarea, "keydown", /*keydown_handler_15*/ ctx[128]),
    					listen(textarea, "keypress", /*keypress_handler_15*/ ctx[129]),
    					listen(textarea, "keyup", /*keyup_handler_15*/ ctx[130]),
    					listen(textarea, "change", /*change_handler_14*/ ctx[131]),
    					listen(textarea, "input", /*input_handler_14*/ ctx[132]),
    					listen(textarea, "input", /*textarea_input_handler*/ ctx[151])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(textarea, /*value*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d(detaching) {
    			if (detaching) detach(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (82:0) {#if tag === 'input'}
    function create_if_block$3(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[3] === 'text') return create_if_block_1$2;
    		if (/*type*/ ctx[3] === 'password') return create_if_block_2$1;
    		if (/*type*/ ctx[3] === 'email') return create_if_block_3;
    		if (/*type*/ ctx[3] === 'file') return create_if_block_4;
    		if (/*type*/ ctx[3] === 'checkbox') return create_if_block_5;
    		if (/*type*/ ctx[3] === 'radio') return create_if_block_6;
    		if (/*type*/ ctx[3] === 'url') return create_if_block_7;
    		if (/*type*/ ctx[3] === 'number') return create_if_block_8;
    		if (/*type*/ ctx[3] === 'date') return create_if_block_9;
    		if (/*type*/ ctx[3] === 'time') return create_if_block_10;
    		if (/*type*/ ctx[3] === 'datetime') return create_if_block_11;
    		if (/*type*/ ctx[3] === 'color') return create_if_block_12;
    		if (/*type*/ ctx[3] === 'range') return create_if_block_13;
    		if (/*type*/ ctx[3] === 'search') return create_if_block_14;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
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
    		i: noop$1,
    		o: noop$1,
    		d(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (322:2) {:else}
    function create_else_block$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: /*type*/ ctx[3] },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] },
    		{ value: /*value*/ ctx[1] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			input.value = input_data.value;
    			if (input.autofocus) input.focus();

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_14*/ ctx[121]),
    					listen(input, "focus", /*focus_handler_14*/ ctx[122]),
    					listen(input, "keydown", /*keydown_handler_14*/ ctx[123]),
    					listen(input, "keypress", /*keypress_handler_14*/ ctx[124]),
    					listen(input, "keyup", /*keyup_handler_14*/ ctx[125]),
    					listen(input, "input", /*handleInput*/ ctx[11]),
    					listen(input, "change", /*handleInput*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				dirty[0] & /*type*/ 8 && { type: /*type*/ ctx[3] },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] },
    				dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1] && { value: /*value*/ ctx[1] }
    			]));

    			if ('value' in input_data) {
    				input.value = input_data.value;
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (305:30) 
    function create_if_block_14(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "search" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_13*/ ctx[114]),
    					listen(input, "focus", /*focus_handler_13*/ ctx[115]),
    					listen(input, "keydown", /*keydown_handler_13*/ ctx[116]),
    					listen(input, "keypress", /*keypress_handler_13*/ ctx[117]),
    					listen(input, "keyup", /*keyup_handler_13*/ ctx[118]),
    					listen(input, "change", /*change_handler_13*/ ctx[119]),
    					listen(input, "input", /*input_handler_13*/ ctx[120]),
    					listen(input, "input", /*input_input_handler_9*/ ctx[150])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "search" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (288:29) 
    function create_if_block_13(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "range" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_12*/ ctx[107]),
    					listen(input, "focus", /*focus_handler_12*/ ctx[108]),
    					listen(input, "keydown", /*keydown_handler_12*/ ctx[109]),
    					listen(input, "keypress", /*keypress_handler_12*/ ctx[110]),
    					listen(input, "keyup", /*keyup_handler_12*/ ctx[111]),
    					listen(input, "change", /*change_handler_12*/ ctx[112]),
    					listen(input, "input", /*input_handler_12*/ ctx[113]),
    					listen(input, "change", /*input_change_input_handler*/ ctx[149]),
    					listen(input, "input", /*input_change_input_handler*/ ctx[149])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "range" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (271:29) 
    function create_if_block_12(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "color" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_11*/ ctx[100]),
    					listen(input, "focus", /*focus_handler_11*/ ctx[101]),
    					listen(input, "keydown", /*keydown_handler_11*/ ctx[102]),
    					listen(input, "keypress", /*keypress_handler_11*/ ctx[103]),
    					listen(input, "keyup", /*keyup_handler_11*/ ctx[104]),
    					listen(input, "change", /*change_handler_11*/ ctx[105]),
    					listen(input, "input", /*input_handler_11*/ ctx[106]),
    					listen(input, "input", /*input_input_handler_8*/ ctx[148])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "color" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (254:32) 
    function create_if_block_11(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "datetime" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_10*/ ctx[93]),
    					listen(input, "focus", /*focus_handler_10*/ ctx[94]),
    					listen(input, "keydown", /*keydown_handler_10*/ ctx[95]),
    					listen(input, "keypress", /*keypress_handler_10*/ ctx[96]),
    					listen(input, "keyup", /*keyup_handler_10*/ ctx[97]),
    					listen(input, "change", /*change_handler_10*/ ctx[98]),
    					listen(input, "input", /*input_handler_10*/ ctx[99]),
    					listen(input, "input", /*input_input_handler_7*/ ctx[147])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "datetime" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (237:28) 
    function create_if_block_10(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "time" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_9*/ ctx[86]),
    					listen(input, "focus", /*focus_handler_9*/ ctx[87]),
    					listen(input, "keydown", /*keydown_handler_9*/ ctx[88]),
    					listen(input, "keypress", /*keypress_handler_9*/ ctx[89]),
    					listen(input, "keyup", /*keyup_handler_9*/ ctx[90]),
    					listen(input, "change", /*change_handler_9*/ ctx[91]),
    					listen(input, "input", /*input_handler_9*/ ctx[92]),
    					listen(input, "input", /*input_input_handler_6*/ ctx[146])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "time" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (220:28) 
    function create_if_block_9(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "date" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_8*/ ctx[79]),
    					listen(input, "focus", /*focus_handler_8*/ ctx[80]),
    					listen(input, "keydown", /*keydown_handler_8*/ ctx[81]),
    					listen(input, "keypress", /*keypress_handler_8*/ ctx[82]),
    					listen(input, "keyup", /*keyup_handler_8*/ ctx[83]),
    					listen(input, "change", /*change_handler_8*/ ctx[84]),
    					listen(input, "input", /*input_handler_8*/ ctx[85]),
    					listen(input, "input", /*input_input_handler_5*/ ctx[145])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "date" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (203:30) 
    function create_if_block_8(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "number" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_7*/ ctx[72]),
    					listen(input, "focus", /*focus_handler_7*/ ctx[73]),
    					listen(input, "keydown", /*keydown_handler_7*/ ctx[74]),
    					listen(input, "keypress", /*keypress_handler_7*/ ctx[75]),
    					listen(input, "keyup", /*keyup_handler_7*/ ctx[76]),
    					listen(input, "change", /*change_handler_7*/ ctx[77]),
    					listen(input, "input", /*input_handler_7*/ ctx[78]),
    					listen(input, "input", /*input_input_handler_4*/ ctx[144])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "number" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && to_number(input.value) !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (186:27) 
    function create_if_block_7(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "url" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_6*/ ctx[65]),
    					listen(input, "focus", /*focus_handler_6*/ ctx[66]),
    					listen(input, "keydown", /*keydown_handler_6*/ ctx[67]),
    					listen(input, "keypress", /*keypress_handler_6*/ ctx[68]),
    					listen(input, "keyup", /*keyup_handler_6*/ ctx[69]),
    					listen(input, "change", /*change_handler_6*/ ctx[70]),
    					listen(input, "input", /*input_handler_6*/ ctx[71]),
    					listen(input, "input", /*input_input_handler_3*/ ctx[143])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "url" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (169:29) 
    function create_if_block_6(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "radio" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_5*/ ctx[58]),
    					listen(input, "focus", /*focus_handler_5*/ ctx[59]),
    					listen(input, "keydown", /*keydown_handler_5*/ ctx[60]),
    					listen(input, "keypress", /*keypress_handler_5*/ ctx[61]),
    					listen(input, "keyup", /*keyup_handler_5*/ ctx[62]),
    					listen(input, "change", /*change_handler_5*/ ctx[63]),
    					listen(input, "input", /*input_handler_5*/ ctx[64]),
    					listen(input, "change", /*input_change_handler_2*/ ctx[142])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "radio" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (151:32) 
    function create_if_block_5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "checkbox" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = /*checked*/ ctx[0];
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_4*/ ctx[51]),
    					listen(input, "focus", /*focus_handler_4*/ ctx[52]),
    					listen(input, "keydown", /*keydown_handler_4*/ ctx[53]),
    					listen(input, "keypress", /*keypress_handler_4*/ ctx[54]),
    					listen(input, "keyup", /*keyup_handler_4*/ ctx[55]),
    					listen(input, "change", /*change_handler_4*/ ctx[56]),
    					listen(input, "input", /*input_handler_4*/ ctx[57]),
    					listen(input, "change", /*input_change_handler_1*/ ctx[141])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "checkbox" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty[0] & /*value*/ 2) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (134:28) 
    function create_if_block_4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "file" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_3*/ ctx[44]),
    					listen(input, "focus", /*focus_handler_3*/ ctx[45]),
    					listen(input, "keydown", /*keydown_handler_3*/ ctx[46]),
    					listen(input, "keypress", /*keypress_handler_3*/ ctx[47]),
    					listen(input, "keyup", /*keyup_handler_3*/ ctx[48]),
    					listen(input, "change", /*change_handler_3*/ ctx[49]),
    					listen(input, "input", /*input_handler_3*/ ctx[50]),
    					listen(input, "change", /*input_change_handler*/ ctx[140])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "file" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (117:29) 
    function create_if_block_3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "email" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_2*/ ctx[37]),
    					listen(input, "focus", /*focus_handler_2*/ ctx[38]),
    					listen(input, "keydown", /*keydown_handler_2*/ ctx[39]),
    					listen(input, "keypress", /*keypress_handler_2*/ ctx[40]),
    					listen(input, "keyup", /*keyup_handler_2*/ ctx[41]),
    					listen(input, "change", /*change_handler_2*/ ctx[42]),
    					listen(input, "input", /*input_handler_2*/ ctx[43]),
    					listen(input, "input", /*input_input_handler_2*/ ctx[139])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "email" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (100:32) 
    function create_if_block_2$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "password" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler_1*/ ctx[30]),
    					listen(input, "focus", /*focus_handler_1*/ ctx[31]),
    					listen(input, "keydown", /*keydown_handler_1*/ ctx[32]),
    					listen(input, "keypress", /*keypress_handler_1*/ ctx[33]),
    					listen(input, "keyup", /*keyup_handler_1*/ ctx[34]),
    					listen(input, "change", /*change_handler_1*/ ctx[35]),
    					listen(input, "input", /*input_handler_1*/ ctx[36]),
    					listen(input, "input", /*input_input_handler_1*/ ctx[138])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "password" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (83:2) {#if type === 'text'}
    function create_if_block_1$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		/*$$restProps*/ ctx[12],
    		{ type: "text" },
    		{ readOnly: /*readonly*/ ctx[4] },
    		{ class: /*classes*/ ctx[9] },
    		{ name: /*name*/ ctx[6] },
    		{ disabled: /*disabled*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	return {
    		c() {
    			input = element("input");
    			set_attributes(input, input_data);
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen(input, "blur", /*blur_handler*/ ctx[23]),
    					listen(input, "focus", /*focus_handler*/ ctx[24]),
    					listen(input, "keydown", /*keydown_handler*/ ctx[25]),
    					listen(input, "keypress", /*keypress_handler*/ ctx[26]),
    					listen(input, "keyup", /*keyup_handler*/ ctx[27]),
    					listen(input, "change", /*change_handler*/ ctx[28]),
    					listen(input, "input", /*input_handler*/ ctx[29]),
    					listen(input, "input", /*input_input_handler*/ ctx[137])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty[0] & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12],
    				{ type: "text" },
    				dirty[0] & /*readonly*/ 16 && { readOnly: /*readonly*/ ctx[4] },
    				dirty[0] & /*classes*/ 512 && { class: /*classes*/ ctx[9] },
    				dirty[0] & /*name*/ 64 && { name: /*name*/ ctx[6] },
    				dirty[0] & /*disabled*/ 256 && { disabled: /*disabled*/ ctx[8] },
    				dirty[0] & /*placeholder*/ 128 && { placeholder: /*placeholder*/ ctx[7] }
    			]));

    			if (dirty[0] & /*value*/ 2 && input.value !== /*value*/ ctx[1]) {
    				set_input_value(input, /*value*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$C(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_15, create_if_block_16];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tag*/ ctx[10] === 'input') return 0;
    		if (/*tag*/ ctx[10] === 'textarea') return 1;
    		if (/*tag*/ ctx[10] === 'select' && !/*multiple*/ ctx[5]) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
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
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$m($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","type","size","bsSize","color","checked","valid","invalid","plaintext","addon","value","files","readonly","multiple","name","placeholder","disabled"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { type = 'text' } = $$props;
    	let { size = undefined } = $$props;
    	let { bsSize = undefined } = $$props;
    	let { color = undefined } = $$props;
    	let { checked = false } = $$props;
    	let { valid = false } = $$props;
    	let { invalid = false } = $$props;
    	let { plaintext = false } = $$props;
    	let { addon = false } = $$props;
    	let { value = '' } = $$props;
    	let { files = '' } = $$props;
    	let { readonly = undefined } = $$props;
    	let { multiple = undefined } = $$props;
    	let { name = '' } = $$props;
    	let { placeholder = '' } = $$props;
    	let { disabled = undefined } = $$props;
    	let classes;
    	let tag;

    	const handleInput = event => {
    		$$invalidate(1, value = event.target.value);
    	};

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_7(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_8(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_9(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_10(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_11(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_12(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_13(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_14(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_16(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_15(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_handler() {
    		files = this.files;
    		$$invalidate(2, files);
    	}

    	function input_change_handler_1() {
    		checked = this.checked;
    		value = this.value;
    		$$invalidate(0, checked);
    		$$invalidate(1, value);
    	}

    	function input_change_handler_2() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_3() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_4() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_5() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_6() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_7() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_input_handler_8() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(1, value);
    	}

    	function input_input_handler_9() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(1, value);
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(1, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(15, className = $$new_props.class);
    		if ('type' in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ('size' in $$new_props) $$invalidate(13, size = $$new_props.size);
    		if ('bsSize' in $$new_props) $$invalidate(14, bsSize = $$new_props.bsSize);
    		if ('color' in $$new_props) $$invalidate(16, color = $$new_props.color);
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('valid' in $$new_props) $$invalidate(17, valid = $$new_props.valid);
    		if ('invalid' in $$new_props) $$invalidate(18, invalid = $$new_props.invalid);
    		if ('plaintext' in $$new_props) $$invalidate(19, plaintext = $$new_props.plaintext);
    		if ('addon' in $$new_props) $$invalidate(20, addon = $$new_props.addon);
    		if ('value' in $$new_props) $$invalidate(1, value = $$new_props.value);
    		if ('files' in $$new_props) $$invalidate(2, files = $$new_props.files);
    		if ('readonly' in $$new_props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ('multiple' in $$new_props) $$invalidate(5, multiple = $$new_props.multiple);
    		if ('name' in $$new_props) $$invalidate(6, name = $$new_props.name);
    		if ('placeholder' in $$new_props) $$invalidate(7, placeholder = $$new_props.placeholder);
    		if ('disabled' in $$new_props) $$invalidate(8, disabled = $$new_props.disabled);
    		if ('$$scope' in $$new_props) $$invalidate(21, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type, plaintext, addon, color, size, className, invalid, valid, bsSize*/ 2088968) {
    			{
    				const checkInput = ['radio', 'checkbox'].indexOf(type) > -1;
    				const isNotaNumber = new RegExp('\\D', 'g');
    				const fileInput = type === 'file';
    				const textareaInput = type === 'textarea';
    				const rangeInput = type === 'range';
    				const selectInput = type === 'select';
    				const buttonInput = type === 'button' || type === 'reset' || type === 'submit';
    				const unsupportedInput = type === 'hidden' || type === 'image';
    				$$invalidate(10, tag = selectInput || textareaInput ? type : 'input');
    				let formControlClass = 'form-control';

    				if (plaintext) {
    					formControlClass = `${formControlClass}-plaintext`;
    					$$invalidate(10, tag = 'input');
    				} else if (fileInput) {
    					formControlClass = `${formControlClass}-file`;
    				} else if (checkInput) {
    					if (addon) {
    						formControlClass = null;
    					} else {
    						formControlClass = 'form-check-input';
    					}
    				} else if (buttonInput) {
    					formControlClass = `btn btn-${color || 'secondary'}`;
    				} else if (rangeInput) {
    					formControlClass = 'form-control-range';
    				} else if (unsupportedInput) {
    					formControlClass = '';
    				}

    				if (size && isNotaNumber.test(size)) {
    					console.warn('Please use the prop "bsSize" instead of the "size" to bootstrap\'s input sizing.');
    					$$invalidate(14, bsSize = size);
    					$$invalidate(13, size = undefined);
    				}

    				$$invalidate(9, classes = classnames(className, invalid && 'is-invalid', valid && 'is-valid', bsSize ? `form-control-${bsSize}` : false, formControlClass));
    			}
    		}
    	};

    	return [
    		checked,
    		value,
    		files,
    		type,
    		readonly,
    		multiple,
    		name,
    		placeholder,
    		disabled,
    		classes,
    		tag,
    		handleInput,
    		$$restProps,
    		size,
    		bsSize,
    		className,
    		color,
    		valid,
    		invalid,
    		plaintext,
    		addon,
    		$$scope,
    		slots,
    		blur_handler,
    		focus_handler,
    		keydown_handler,
    		keypress_handler,
    		keyup_handler,
    		change_handler,
    		input_handler,
    		blur_handler_1,
    		focus_handler_1,
    		keydown_handler_1,
    		keypress_handler_1,
    		keyup_handler_1,
    		change_handler_1,
    		input_handler_1,
    		blur_handler_2,
    		focus_handler_2,
    		keydown_handler_2,
    		keypress_handler_2,
    		keyup_handler_2,
    		change_handler_2,
    		input_handler_2,
    		blur_handler_3,
    		focus_handler_3,
    		keydown_handler_3,
    		keypress_handler_3,
    		keyup_handler_3,
    		change_handler_3,
    		input_handler_3,
    		blur_handler_4,
    		focus_handler_4,
    		keydown_handler_4,
    		keypress_handler_4,
    		keyup_handler_4,
    		change_handler_4,
    		input_handler_4,
    		blur_handler_5,
    		focus_handler_5,
    		keydown_handler_5,
    		keypress_handler_5,
    		keyup_handler_5,
    		change_handler_5,
    		input_handler_5,
    		blur_handler_6,
    		focus_handler_6,
    		keydown_handler_6,
    		keypress_handler_6,
    		keyup_handler_6,
    		change_handler_6,
    		input_handler_6,
    		blur_handler_7,
    		focus_handler_7,
    		keydown_handler_7,
    		keypress_handler_7,
    		keyup_handler_7,
    		change_handler_7,
    		input_handler_7,
    		blur_handler_8,
    		focus_handler_8,
    		keydown_handler_8,
    		keypress_handler_8,
    		keyup_handler_8,
    		change_handler_8,
    		input_handler_8,
    		blur_handler_9,
    		focus_handler_9,
    		keydown_handler_9,
    		keypress_handler_9,
    		keyup_handler_9,
    		change_handler_9,
    		input_handler_9,
    		blur_handler_10,
    		focus_handler_10,
    		keydown_handler_10,
    		keypress_handler_10,
    		keyup_handler_10,
    		change_handler_10,
    		input_handler_10,
    		blur_handler_11,
    		focus_handler_11,
    		keydown_handler_11,
    		keypress_handler_11,
    		keyup_handler_11,
    		change_handler_11,
    		input_handler_11,
    		blur_handler_12,
    		focus_handler_12,
    		keydown_handler_12,
    		keypress_handler_12,
    		keyup_handler_12,
    		change_handler_12,
    		input_handler_12,
    		blur_handler_13,
    		focus_handler_13,
    		keydown_handler_13,
    		keypress_handler_13,
    		keyup_handler_13,
    		change_handler_13,
    		input_handler_13,
    		blur_handler_14,
    		focus_handler_14,
    		keydown_handler_14,
    		keypress_handler_14,
    		keyup_handler_14,
    		blur_handler_15,
    		focus_handler_15,
    		keydown_handler_15,
    		keypress_handler_15,
    		keyup_handler_15,
    		change_handler_14,
    		input_handler_14,
    		blur_handler_16,
    		focus_handler_16,
    		change_handler_15,
    		input_handler_15,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		input_change_handler,
    		input_change_handler_1,
    		input_change_handler_2,
    		input_input_handler_3,
    		input_input_handler_4,
    		input_input_handler_5,
    		input_input_handler_6,
    		input_input_handler_7,
    		input_input_handler_8,
    		input_change_input_handler,
    		input_input_handler_9,
    		textarea_input_handler,
    		select_change_handler
    	];
    }

    class Input extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(
    			this,
    			options,
    			instance$m,
    			create_fragment$C,
    			safe_not_equal,
    			{
    				class: 15,
    				type: 3,
    				size: 13,
    				bsSize: 14,
    				color: 16,
    				checked: 0,
    				valid: 17,
    				invalid: 18,
    				plaintext: 19,
    				addon: 20,
    				value: 1,
    				files: 2,
    				readonly: 4,
    				multiple: 5,
    				name: 6,
    				placeholder: 7,
    				disabled: 8
    			},
    			null,
    			[-1, -1, -1, -1, -1]
    		);
    	}
    }

    /* node_modules/sveltestrap/src/Label.svelte generated by Svelte v3.50.1 */

    function create_fragment$B(ctx) {
    	let label;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	let label_levels = [
    		/*$$restProps*/ ctx[2],
    		{ class: /*classes*/ ctx[1] },
    		{ for: /*fore*/ ctx[0] }
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	return {
    		c() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    		},
    		m(target, anchor) {
    			insert(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(label, label_data = get_spread_update(label_levels, [
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2],
    				(!current || dirty & /*classes*/ 2) && { class: /*classes*/ ctx[1] },
    				(!current || dirty & /*fore*/ 1) && { for: /*fore*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(label);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","hidden","check","size","for","xs","sm","md","lg","xl","widths"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { hidden = false } = $$props;
    	let { check = false } = $$props;
    	let { size = '' } = $$props;
    	let { for: fore = null } = $$props;
    	let { xs = '' } = $$props;
    	let { sm = '' } = $$props;
    	let { md = '' } = $$props;
    	let { lg = '' } = $$props;
    	let { xl = '' } = $$props;
    	const colWidths = { xs, sm, md, lg, xl };
    	let { widths = Object.keys(colWidths) } = $$props;
    	const colClasses = [];

    	widths.forEach(colWidth => {
    		let columnProp = $$props[colWidth];

    		if (!columnProp && columnProp !== '') {
    			return;
    		}

    		const isXs = colWidth === 'xs';
    		let colClass;

    		if (isObject(columnProp)) {
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

    			colClasses.push(classnames({
    				[colClass]: columnProp.size || columnProp.size === '',
    				[`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
    				[`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
    			}));
    		} else {
    			colClass = getColumnSizeClass(isXs, colWidth, columnProp);
    			colClasses.push(colClass);
    		}
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('hidden' in $$new_props) $$invalidate(4, hidden = $$new_props.hidden);
    		if ('check' in $$new_props) $$invalidate(5, check = $$new_props.check);
    		if ('size' in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ('for' in $$new_props) $$invalidate(0, fore = $$new_props.for);
    		if ('xs' in $$new_props) $$invalidate(7, xs = $$new_props.xs);
    		if ('sm' in $$new_props) $$invalidate(8, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(9, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(10, lg = $$new_props.lg);
    		if ('xl' in $$new_props) $$invalidate(11, xl = $$new_props.xl);
    		if ('widths' in $$new_props) $$invalidate(12, widths = $$new_props.widths);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, hidden, check, size*/ 120) {
    			$$invalidate(1, classes = classnames(className, hidden ? 'sr-only' : false, check ? 'form-check-label' : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? 'col-form-label' : false));
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		fore,
    		classes,
    		$$restProps,
    		className,
    		hidden,
    		check,
    		size,
    		xs,
    		sm,
    		md,
    		lg,
    		xl,
    		widths,
    		$$scope,
    		slots
    	];
    }

    class Label extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$l, create_fragment$B, safe_not_equal, {
    			class: 3,
    			hidden: 4,
    			check: 5,
    			size: 6,
    			for: 0,
    			xs: 7,
    			sm: 8,
    			md: 9,
    			lg: 10,
    			xl: 11,
    			widths: 12
    		});
    	}
    }

    /* node_modules/sveltestrap/src/Modal.svelte generated by Svelte v3.50.1 */

    const get_external_slot_changes = dirty => ({});
    const get_external_slot_context = ctx => ({});

    // (217:0) {#if _isMounted}
    function create_if_block$2(ctx) {
    	let div;
    	let current;
    	let if_block = /*isOpen*/ ctx[1] && create_if_block_1$1(ctx);

    	let div_levels = [
    		{ class: /*wrapClassName*/ ctx[4] },
    		{ tabindex: "-1" },
    		/*$$restProps*/ ctx[18]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (if_block) if_block.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (/*isOpen*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*isOpen*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*wrapClassName*/ 16) && { class: /*wrapClassName*/ ctx[4] },
    				{ tabindex: "-1" },
    				dirty[0] & /*$$restProps*/ 262144 && /*$$restProps*/ ctx[18]
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (if_block) if_block.d();
    		}
    	};
    }

    // (222:4) {#if isOpen}
    function create_if_block_1$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let div0_class_value;
    	let div2_class_value;
    	let div2_transition;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const external_slot_template = /*#slots*/ ctx[33].external;
    	const external_slot = create_slot(external_slot_template, ctx, /*$$scope*/ ctx[32], get_external_slot_context);
    	const default_slot_template = /*#slots*/ ctx[33].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[32], null);
    	let if_block = /*backdrop*/ ctx[3] && !/*staticModal*/ ctx[0] && create_if_block_2(ctx);

    	return {
    		c() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (external_slot) external_slot.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr(div0, "class", div0_class_value = classnames('modal-content', /*contentClassName*/ ctx[7]));
    			attr(div1, "class", /*classes*/ ctx[13]);
    			attr(div1, "role", "document");
    			attr(div2, "arialabelledby", /*labelledBy*/ ctx[2]);

    			attr(div2, "class", div2_class_value = classnames('modal', /*modalClassName*/ ctx[5], {
    				show: /*isOpen*/ ctx[1],
    				'd-block': /*isOpen*/ ctx[1],
    				'd-none': !/*isOpen*/ ctx[1],
    				'position-static': /*staticModal*/ ctx[0]
    			}));

    			attr(div2, "role", "dialog");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, div0);

    			if (external_slot) {
    				external_slot.m(div0, null);
    			}

    			append(div0, t0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div1_binding*/ ctx[34](div1);
    			insert(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(div2, "introend", /*onModalOpened*/ ctx[15]),
    					listen(div2, "outroend", /*onModalClosed*/ ctx[16]),
    					listen(div2, "click", /*handleBackdropClick*/ ctx[14]),
    					listen(div2, "mousedown", /*handleBackdropMouseDown*/ ctx[17])
    				];

    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (external_slot) {
    				if (external_slot.p && (!current || dirty[1] & /*$$scope*/ 2)) {
    					update_slot_base(
    						external_slot,
    						external_slot_template,
    						ctx,
    						/*$$scope*/ ctx[32],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[32])
    						: get_slot_changes(external_slot_template, /*$$scope*/ ctx[32], dirty, get_external_slot_changes),
    						get_external_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[32],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[32])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[32], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*contentClassName*/ 128 && div0_class_value !== (div0_class_value = classnames('modal-content', /*contentClassName*/ ctx[7]))) {
    				attr(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*classes*/ 8192) {
    				attr(div1, "class", /*classes*/ ctx[13]);
    			}

    			if (!current || dirty[0] & /*labelledBy*/ 4) {
    				attr(div2, "arialabelledby", /*labelledBy*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*modalClassName, isOpen, staticModal*/ 35 && div2_class_value !== (div2_class_value = classnames('modal', /*modalClassName*/ ctx[5], {
    				show: /*isOpen*/ ctx[1],
    				'd-block': /*isOpen*/ ctx[1],
    				'd-none': !/*isOpen*/ ctx[1],
    				'position-static': /*staticModal*/ ctx[0]
    			}))) {
    				attr(div2, "class", div2_class_value);
    			}

    			if (/*backdrop*/ ctx[3] && !/*staticModal*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*backdrop, staticModal*/ 9) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(external_slot, local);
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[9], /*transitionOptions*/ ctx[10], true);
    				div2_transition.run(1);
    			});

    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(external_slot, local);
    			transition_out(default_slot, local);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, /*transitionType*/ ctx[9], /*transitionOptions*/ ctx[10], false);
    			div2_transition.run(0);
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div2);
    			if (external_slot) external_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[34](null);
    			if (detaching && div2_transition) div2_transition.end();
    			if (detaching) detach(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (244:6) {#if backdrop && !staticModal}
    function create_if_block_2(ctx) {
    	let div;
    	let div_class_value;
    	let div_transition;
    	let current;

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", div_class_value = classnames('modal-backdrop', 'show', /*backdropClassName*/ ctx[6]));
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			current = true;
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*backdropClassName*/ 64 && div_class_value !== (div_class_value = classnames('modal-backdrop', 'show', /*backdropClassName*/ ctx[6]))) {
    				attr(div, "class", div_class_value);
    			}
    		},
    		i(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[8] }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: /*backdropDuration*/ ctx[8] }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};
    }

    function create_fragment$A(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*_isMounted*/ ctx[11] && create_if_block$2(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (/*_isMounted*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*_isMounted*/ 2048) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    let openCount = 0;
    const dialogBaseClass = 'modal-dialog';

    function noop() {
    	
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","static","isOpen","autoFocus","centered","scrollable","size","toggle","labelledBy","backdrop","onEnter","onExit","onOpened","onClosed","wrapClassName","modalClassName","backdropClassName","contentClassName","fade","backdropDuration","unmountOnClose","returnFocusAfterClose","transitionType","transitionOptions"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { static: staticModal = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { autoFocus = true } = $$props;
    	let { centered = false } = $$props;
    	let { scrollable = false } = $$props;
    	let { size = '' } = $$props;
    	let { toggle = undefined } = $$props;
    	let { labelledBy = '' } = $$props;
    	let { backdrop = true } = $$props;
    	let { onEnter = undefined } = $$props;
    	let { onExit = undefined } = $$props;
    	let { onOpened = noop } = $$props;
    	let { onClosed = noop } = $$props;
    	let { wrapClassName = '' } = $$props;
    	let { modalClassName = '' } = $$props;
    	let { backdropClassName = '' } = $$props;
    	let { contentClassName = '' } = $$props;
    	let { fade: fade$1 = true } = $$props;
    	let { backdropDuration = fade$1 ? 150 : 0 } = $$props;
    	let { unmountOnClose = true } = $$props;
    	let { returnFocusAfterClose = true } = $$props;
    	let { transitionType = fade } = $$props;
    	let { transitionOptions = { duration: fade$1 ? 300 : 0 } } = $$props;
    	let hasOpened = false;
    	let _isMounted = false;
    	let _triggeringElement;
    	let _originalBodyPadding;
    	let _lastIsOpen = isOpen;
    	let _lastHasOpened = hasOpened;
    	let _dialog;
    	let _mouseDownElement;
    	let _removeEscListener;

    	onMount(() => {
    		if (isOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (typeof onEnter === 'function') {
    			onEnter();
    		}

    		if (hasOpened && autoFocus) {
    			setFocus();
    		}
    	});

    	onDestroy(() => {
    		if (typeof onExit === 'function') {
    			onExit();
    		}

    		destroy();

    		if (hasOpened) {
    			close();
    		}
    	});

    	afterUpdate(() => {
    		if (isOpen && !_lastIsOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (autoFocus && hasOpened && !_lastHasOpened) {
    			setFocus();
    		}

    		_lastIsOpen = isOpen;
    		_lastHasOpened = hasOpened;
    	});

    	function setFocus() {
    		if (_dialog && _dialog.parentNode && typeof _dialog.parentNode.focus === 'function') {
    			_dialog.parentNode.focus();
    		}
    	}

    	function init() {
    		try {
    			_triggeringElement = document.activeElement;
    		} catch(err) {
    			_triggeringElement = null;
    		}

    		if (!staticModal) {
    			_originalBodyPadding = getOriginalBodyPadding();
    			conditionallyUpdateScrollbar();

    			if (openCount === 0) {
    				document.body.className = classnames(document.body.className, 'modal-open');
    			}

    			++openCount;
    		}

    		$$invalidate(11, _isMounted = true);
    	}

    	function manageFocusAfterClose() {
    		if (_triggeringElement) {
    			if (typeof _triggeringElement.focus === 'function' && returnFocusAfterClose) {
    				_triggeringElement.focus();
    			}

    			_triggeringElement = null;
    		}
    	}

    	function destroy() {
    		manageFocusAfterClose();
    	}

    	function close() {
    		if (openCount <= 1) {
    			const modalOpenClassName = 'modal-open';
    			const modalOpenClassNameRegex = new RegExp(`(^| )${modalOpenClassName}( |$)`);
    			document.body.className = document.body.className.replace(modalOpenClassNameRegex, ' ').trim();
    		}

    		manageFocusAfterClose();
    		openCount = Math.max(0, openCount - 1);
    		setScrollbarWidth(_originalBodyPadding);
    	}

    	function handleBackdropClick(e) {
    		if (e.target === _mouseDownElement) {
    			e.stopPropagation();

    			if (!isOpen || !backdrop) {
    				return;
    			}

    			const backdropElem = _dialog ? _dialog.parentNode : null;

    			if (backdropElem && e.target === backdropElem && toggle) {
    				toggle(e);
    			}
    		}
    	}

    	function onModalOpened() {
    		_removeEscListener = browserEvent(document, 'keydown', event => {
    			if (event.key && event.key === 'Escape') {
    				toggle(event);
    			}
    		});

    		onOpened();
    	}

    	function onModalClosed() {
    		onClosed();

    		if (_removeEscListener) {
    			_removeEscListener();
    		}

    		if (unmountOnClose) {
    			destroy();
    		}

    		close();

    		if (_isMounted) {
    			hasOpened = false;
    		}

    		$$invalidate(11, _isMounted = false);
    	}

    	function handleBackdropMouseDown(e) {
    		_mouseDownElement = e.target;
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			_dialog = $$value;
    			$$invalidate(12, _dialog);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(19, className = $$new_props.class);
    		if ('static' in $$new_props) $$invalidate(0, staticModal = $$new_props.static);
    		if ('isOpen' in $$new_props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ('autoFocus' in $$new_props) $$invalidate(20, autoFocus = $$new_props.autoFocus);
    		if ('centered' in $$new_props) $$invalidate(21, centered = $$new_props.centered);
    		if ('scrollable' in $$new_props) $$invalidate(22, scrollable = $$new_props.scrollable);
    		if ('size' in $$new_props) $$invalidate(23, size = $$new_props.size);
    		if ('toggle' in $$new_props) $$invalidate(24, toggle = $$new_props.toggle);
    		if ('labelledBy' in $$new_props) $$invalidate(2, labelledBy = $$new_props.labelledBy);
    		if ('backdrop' in $$new_props) $$invalidate(3, backdrop = $$new_props.backdrop);
    		if ('onEnter' in $$new_props) $$invalidate(25, onEnter = $$new_props.onEnter);
    		if ('onExit' in $$new_props) $$invalidate(26, onExit = $$new_props.onExit);
    		if ('onOpened' in $$new_props) $$invalidate(27, onOpened = $$new_props.onOpened);
    		if ('onClosed' in $$new_props) $$invalidate(28, onClosed = $$new_props.onClosed);
    		if ('wrapClassName' in $$new_props) $$invalidate(4, wrapClassName = $$new_props.wrapClassName);
    		if ('modalClassName' in $$new_props) $$invalidate(5, modalClassName = $$new_props.modalClassName);
    		if ('backdropClassName' in $$new_props) $$invalidate(6, backdropClassName = $$new_props.backdropClassName);
    		if ('contentClassName' in $$new_props) $$invalidate(7, contentClassName = $$new_props.contentClassName);
    		if ('fade' in $$new_props) $$invalidate(29, fade$1 = $$new_props.fade);
    		if ('backdropDuration' in $$new_props) $$invalidate(8, backdropDuration = $$new_props.backdropDuration);
    		if ('unmountOnClose' in $$new_props) $$invalidate(30, unmountOnClose = $$new_props.unmountOnClose);
    		if ('returnFocusAfterClose' in $$new_props) $$invalidate(31, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ('transitionType' in $$new_props) $$invalidate(9, transitionType = $$new_props.transitionType);
    		if ('transitionOptions' in $$new_props) $$invalidate(10, transitionOptions = $$new_props.transitionOptions);
    		if ('$$scope' in $$new_props) $$invalidate(32, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*className, size, centered, scrollable*/ 15204352) {
    			$$invalidate(13, classes = classnames(dialogBaseClass, className, {
    				[`modal-${size}`]: size,
    				[`${dialogBaseClass}-centered`]: centered,
    				[`${dialogBaseClass}-scrollable`]: scrollable
    			}));
    		}
    	};

    	return [
    		staticModal,
    		isOpen,
    		labelledBy,
    		backdrop,
    		wrapClassName,
    		modalClassName,
    		backdropClassName,
    		contentClassName,
    		backdropDuration,
    		transitionType,
    		transitionOptions,
    		_isMounted,
    		_dialog,
    		classes,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosed,
    		handleBackdropMouseDown,
    		$$restProps,
    		className,
    		autoFocus,
    		centered,
    		scrollable,
    		size,
    		toggle,
    		onEnter,
    		onExit,
    		onOpened,
    		onClosed,
    		fade$1,
    		unmountOnClose,
    		returnFocusAfterClose,
    		$$scope,
    		slots,
    		div1_binding
    	];
    }

    class Modal extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(
    			this,
    			options,
    			instance$k,
    			create_fragment$A,
    			safe_not_equal,
    			{
    				class: 19,
    				static: 0,
    				isOpen: 1,
    				autoFocus: 20,
    				centered: 21,
    				scrollable: 22,
    				size: 23,
    				toggle: 24,
    				labelledBy: 2,
    				backdrop: 3,
    				onEnter: 25,
    				onExit: 26,
    				onOpened: 27,
    				onClosed: 28,
    				wrapClassName: 4,
    				modalClassName: 5,
    				backdropClassName: 6,
    				contentClassName: 7,
    				fade: 29,
    				backdropDuration: 8,
    				unmountOnClose: 30,
    				returnFocusAfterClose: 31,
    				transitionType: 9,
    				transitionOptions: 10
    			},
    			null,
    			[-1, -1]
    		);
    	}
    }

    /* node_modules/sveltestrap/src/ModalBody.svelte generated by Svelte v3.50.1 */

    function create_fragment$z(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, 'modal-body'));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalBody extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$j, create_fragment$z, safe_not_equal, { class: 2 });
    	}
    }

    /* node_modules/sveltestrap/src/ModalHeader.svelte generated by Svelte v3.50.1 */
    const get_close_slot_changes = dirty => ({});
    const get_close_slot_context = ctx => ({});

    // (21:4) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (19:4) {#if children}
    function create_if_block_1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text(/*children*/ ctx[2]);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*children*/ 4) set_data(t, /*children*/ ctx[2]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (26:4) {#if typeof toggle === 'function'}
    function create_if_block$1(ctx) {
    	let button;
    	let span;
    	let t;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			button = element("button");
    			span = element("span");
    			t = text(/*closeIcon*/ ctx[4]);
    			attr(span, "aria-hidden", "true");
    			attr(button, "type", "button");
    			attr(button, "class", "close");
    			attr(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			append(button, span);
    			append(span, t);

    			if (!mounted) {
    				dispose = listen(button, "click", function () {
    					if (is_function(/*toggle*/ ctx[0])) /*toggle*/ ctx[0].apply(this, arguments);
    				});

    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*closeIcon*/ 16) set_data(t, /*closeIcon*/ ctx[4]);

    			if (dirty & /*closeAriaLabel*/ 2) {
    				attr(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (25:21)      
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let if_block = typeof /*toggle*/ ctx[0] === 'function' && create_if_block$1(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (typeof /*toggle*/ ctx[0] === 'function') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function create_fragment$y(ctx) {
    	let div;
    	let h5;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const close_slot_template = /*#slots*/ ctx[9].close;
    	const close_slot = create_slot(close_slot_template, ctx, /*$$scope*/ ctx[8], get_close_slot_context);
    	const close_slot_or_fallback = close_slot || fallback_block(ctx);
    	let div_levels = [/*$$restProps*/ ctx[5], { class: /*classes*/ ctx[3] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			h5 = element("h5");
    			if_block.c();
    			t = space();
    			if (close_slot_or_fallback) close_slot_or_fallback.c();
    			attr(h5, "class", "modal-title");
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h5);
    			if_blocks[current_block_type_index].m(h5, null);
    			append(div, t);

    			if (close_slot_or_fallback) {
    				close_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(h5, null);
    			}

    			if (close_slot) {
    				if (close_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						close_slot,
    						close_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(close_slot_template, /*$$scope*/ ctx[8], dirty, get_close_slot_changes),
    						get_close_slot_context
    					);
    				}
    			} else {
    				if (close_slot_or_fallback && close_slot_or_fallback.p && (!current || dirty & /*closeAriaLabel, toggle, closeIcon*/ 19)) {
    					close_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(close_slot_or_fallback, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			transition_out(close_slot_or_fallback, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if_blocks[current_block_type_index].d();
    			if (close_slot_or_fallback) close_slot_or_fallback.d(detaching);
    		}
    	};
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let closeIcon;
    	let classes;
    	const omit_props_names = ["class","toggle","closeAriaLabel","charCode","children"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { toggle = undefined } = $$props;
    	let { closeAriaLabel = 'Close' } = $$props;
    	let { charCode = 215 } = $$props;
    	let { children = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(6, className = $$new_props.class);
    		if ('toggle' in $$new_props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ('closeAriaLabel' in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('charCode' in $$new_props) $$invalidate(7, charCode = $$new_props.charCode);
    		if ('children' in $$new_props) $$invalidate(2, children = $$new_props.children);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*charCode*/ 128) {
    			$$invalidate(4, closeIcon = typeof charCode === 'number'
    			? String.fromCharCode(charCode)
    			: charCode);
    		}

    		if ($$self.$$.dirty & /*className*/ 64) {
    			$$invalidate(3, classes = classnames(className, 'modal-header'));
    		}
    	};

    	return [
    		toggle,
    		closeAriaLabel,
    		children,
    		classes,
    		closeIcon,
    		$$restProps,
    		className,
    		charCode,
    		$$scope,
    		slots
    	];
    }

    class ModalHeader extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$i, create_fragment$y, safe_not_equal, {
    			class: 6,
    			toggle: 0,
    			closeAriaLabel: 1,
    			charCode: 7,
    			children: 2
    		});
    	}
    }

    /* node_modules/sveltestrap/src/Row.svelte generated by Svelte v3.50.1 */

    function create_fragment$x(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function getCols(cols) {
    	const colsValue = parseInt(cols);

    	if (!isNaN(colsValue)) {
    		if (colsValue > 0) {
    			return [`row-cols-${colsValue}`];
    		}
    	} else if (typeof cols === 'object') {
    		return ['xs', 'sm', 'md', 'lg', 'xl'].map(colWidth => {
    			const isXs = colWidth === 'xs';
    			const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
    			const value = cols[colWidth];

    			if (typeof value === 'number' && value > 0) {
    				return `row-cols${colSizeInterfix}${value}`;
    			}

    			return null;
    		}).filter(value => !!value);
    	}

    	return [];
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","noGutters","form","cols"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { class: className = '' } = $$props;
    	let { noGutters = false } = $$props;
    	let { form = false } = $$props;
    	let { cols = 0 } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('noGutters' in $$new_props) $$invalidate(3, noGutters = $$new_props.noGutters);
    		if ('form' in $$new_props) $$invalidate(4, form = $$new_props.form);
    		if ('cols' in $$new_props) $$invalidate(5, cols = $$new_props.cols);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, noGutters, form, cols*/ 60) {
    			$$invalidate(0, classes = classnames(className, noGutters ? 'no-gutters' : null, form ? 'form-row' : 'row', ...getCols(cols)));
    		}
    	};

    	return [classes, $$restProps, className, noGutters, form, cols, $$scope, slots];
    }

    class Row extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$h, create_fragment$x, safe_not_equal, { class: 2, noGutters: 3, form: 4, cols: 5 });
    	}
    }

    /* src/Components/Navbar.svelte generated by Svelte v3.50.1 */

    function create_default_slot_2$m(ctx) {
    	let img;
    	let img_src_value;

    	return {
    		c() {
    			img = element("img");
    			attr(img, "width", "140px");
    			if (!src_url_equal(img.src, img_src_value = "images/logo.png")) attr(img, "src", img_src_value);
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(img);
    		}
    	};
    }

    // (73:6) <Button class="navbar-toggler" on:click={toggleMenu}>
    function create_default_slot_1$m(ctx) {
    	let i;

    	return {
    		c() {
    			i = element("i");
    			attr(i, "class", "mdi mdi-menu");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(i);
    		}
    	};
    }

    // (109:14) <Button class="btn btn-primary navbar-btn btn-rounded waves-effect waves-light">
    function create_default_slot$m(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("CONTACT US");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    function create_fragment$w(ctx) {
    	let div3;
    	let nav;
    	let div2;
    	let link;
    	let t0;
    	let button0;
    	let t1;
    	let div1;
    	let ul0;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;
    	let t9;
    	let li4;
    	let a4;
    	let t11;
    	let li5;
    	let a5;
    	let t13;
    	let li6;
    	let a6;
    	let t15;
    	let div0;
    	let ul1;
    	let li7;
    	let button1;
    	let nav_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link({
    			props: {
    				class: "navbar-brand logo text-uppercase",
    				to: "/",
    				$$slots: { default: [create_default_slot_2$m] },
    				$$scope: { ctx }
    			}
    		});

    	button0 = new Button({
    			props: {
    				class: "navbar-toggler",
    				$$slots: { default: [create_default_slot_1$m] },
    				$$scope: { ctx }
    			}
    		});

    	button0.$on("click", /*toggleMenu*/ ctx[1]);

    	button1 = new Button({
    			props: {
    				class: "btn btn-primary navbar-btn btn-rounded waves-effect waves-light",
    				$$slots: { default: [create_default_slot$m] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div3 = element("div");
    			nav = element("nav");
    			div2 = element("div");
    			create_component(link.$$.fragment);
    			t0 = space();
    			create_component(button0.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Features";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Services";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "About";
    			t9 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "Pricing";
    			t11 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Blog";
    			t13 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "Contact";
    			t15 = space();
    			div0 = element("div");
    			ul1 = element("ul");
    			li7 = element("li");
    			create_component(button1.$$.fragment);
    			attr(a0, "href", "#home");
    			attr(a0, "class", "nav-link active");
    			attr(li0, "class", "nav-item");
    			attr(a1, "href", "#features");
    			attr(a1, "class", "nav-link");
    			attr(li1, "class", "nav-item");
    			attr(a2, "href", "#services");
    			attr(a2, "class", "nav-link");
    			attr(li2, "class", "nav-item");
    			attr(a3, "href", "#about");
    			attr(a3, "class", "nav-link");
    			attr(li3, "class", "nav-item");
    			attr(a4, "href", "#pricing");
    			attr(a4, "class", "nav-link");
    			attr(li4, "class", "nav-item");
    			attr(a5, "href", "#blog");
    			attr(a5, "class", "nav-link");
    			attr(li5, "class", "nav-item");
    			attr(a6, "href", "#contact");
    			attr(a6, "class", "nav-link");
    			attr(li6, "class", "nav-item");
    			attr(ul0, "class", "navbar-nav navbar-center");
    			attr(ul0, "id", "navbar-navlist");
    			attr(ul1, "class", "nav navbar-nav navbar-end");
    			attr(div0, "class", "nav-button ms-auto");
    			attr(div1, "class", "collapse navbar-collapse");
    			attr(div1, "id", "navbarCollapse");
    			attr(div2, "class", "container");
    			attr(nav, "class", nav_class_value = "navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark " + /*extraclass*/ ctx[0]);
    			attr(nav, "id", "navbar");
    			attr(div3, "id", "navbar");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, nav);
    			append(nav, div2);
    			mount_component(link, div2, null);
    			append(div2, t0);
    			mount_component(button0, div2, null);
    			append(div2, t1);
    			append(div2, div1);
    			append(div1, ul0);
    			append(ul0, li0);
    			append(li0, a0);
    			append(ul0, t3);
    			append(ul0, li1);
    			append(li1, a1);
    			append(ul0, t5);
    			append(ul0, li2);
    			append(li2, a2);
    			append(ul0, t7);
    			append(ul0, li3);
    			append(li3, a3);
    			append(ul0, t9);
    			append(ul0, li4);
    			append(li4, a4);
    			append(ul0, t11);
    			append(ul0, li5);
    			append(li5, a5);
    			append(ul0, t13);
    			append(ul0, li6);
    			append(li6, a6);
    			append(div1, t15);
    			append(div1, div0);
    			append(div0, ul1);
    			append(ul1, li7);
    			mount_component(button1, li7, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(scrollto.call(null, a0, "#home")),
    					action_destroyer(scrollto.call(null, a1, "#features")),
    					action_destroyer(scrollto.call(null, a2, "#services")),
    					action_destroyer(scrollto.call(null, a3, "#about")),
    					action_destroyer(scrollto.call(null, a4, "#pricing")),
    					action_destroyer(scrollto.call(null, a5, "#blog")),
    					action_destroyer(scrollto.call(null, a6, "#contact"))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (!current || dirty & /*extraclass*/ 1 && nav_class_value !== (nav_class_value = "navbar navbar-expand-lg fixed-top navbar-custom sticky sticky-dark " + /*extraclass*/ ctx[0])) {
    				attr(nav, "class", nav_class_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div3);
    			destroy_component(link);
    			destroy_component(button0);
    			destroy_component(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { extraclass } = $$props;

    	/**
     * Toggle menu
     */
    	const toggleMenu = () => {
    		document.getElementById("navbarCollapse").classList.toggle("show");
    	};

    	/**
     * Component mount
     */
    	onMount(() => {
    		var section = document.querySelectorAll(".common-section");
    		var sections = {};
    		var i = 0;

    		Array.prototype.forEach.call(section, function (e) {
    			sections[e.id] = e.offsetTop;
    		});

    		window.onscroll = function () {
    			var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    			for (i in sections) {
    				if (sections[i] <= scrollPosition) {
    					document.querySelector(".active").setAttribute("class", "nav-link");
    					document.querySelector("a[href*=" + i + "]").setAttribute("class", "nav-link active");
    				}
    			}
    		};
    	});

    	/**
     * Scroll method
     */
    	const handleScroll = () => {
    		var navbar = document.getElementById("navbar");

    		if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    			navbar.classList.add("is-sticky");
    		} else {
    			navbar.classList.remove("is-sticky");
    		}
    	};

    	window.addEventListener("scroll", handleScroll, { passive: false });

    	$$self.$$set = $$props => {
    		if ('extraclass' in $$props) $$invalidate(0, extraclass = $$props.extraclass);
    	};

    	return [extraclass, toggleMenu];
    }

    class Navbar extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$g, create_fragment$w, safe_not_equal, { extraclass: 0 });
    	}
    }

    /* src/routes/Layout1/HomeSection.svelte generated by Svelte v3.50.1 */

    function create_default_slot_4$h(ctx) {
    	let video;
    	let video_src_value;

    	return {
    		c() {
    			video = element("video");
    			video.innerHTML = `<track default="" kind="captions" type="video/mp4"/>`;
    			attr(video, "id", "VisaChipCardVideo");
    			attr(video, "class", "video-box");
    			if (!src_url_equal(video.src, video_src_value = "https://www.w3schools.com/html/mov_bbb.mp4")) attr(video, "src", video_src_value);
    			video.controls = true;
    		},
    		m(target, anchor) {
    			insert(target, video, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(video);
    		}
    	};
    }

    // (31:4) <Modal isOpen={open} size="lg" {toggle} class="home-modal">
    function create_default_slot_3$i(ctx) {
    	let modalheader;
    	let t;
    	let modalbody;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle: /*toggle*/ ctx[1],
    				class: "border-0"
    			}
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_4$h] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(modalheader.$$.fragment);
    			t = space();
    			create_component(modalbody.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert(target, t, anchor);
    			mount_component(modalbody, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach(t);
    			destroy_component(modalbody, detaching);
    		}
    	};
    }

    // (19:3) <Col lg={8} class="text-white text-center">
    function create_default_slot_2$l(ctx) {
    	let h4;
    	let t1;
    	let h1;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t6;
    	let modal;
    	let current;
    	let mounted;
    	let dispose;

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[0],
    				size: "lg",
    				toggle: /*toggle*/ ctx[1],
    				class: "home-modal",
    				$$slots: { default: [create_default_slot_3$i] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Awesome Design";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "We love make things amazing and simple";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Maecenas class semper class semper sollicitudin lectus lorem iaculis imperdiet aliquam vehicula\n\t\t\t\t\ttempor auctor curabitur pede aenean ornare.";
    			t5 = space();
    			p1 = element("p");
    			p1.innerHTML = `<a href="${'#'}" class="play-btn video-play-icon"><i class="mdi mdi-play text-center"></i></a>`;
    			t6 = space();
    			create_component(modal.$$.fragment);
    			attr(h4, "class", "home-small-title");
    			attr(h1, "class", "home-title");
    			attr(p0, "class", "pt-3 home-desc mx-auto");
    			attr(p1, "class", "play-shadow mt-4");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, p0, anchor);
    			insert(target, t5, anchor);
    			insert(target, p1, anchor);
    			insert(target, t6, anchor);
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen(p1, "click", /*toggle*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.isOpen = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(p0);
    			if (detaching) detach(t5);
    			if (detaching) detach(p1);
    			if (detaching) detach(t6);
    			destroy_component(modal, detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (18:2) <Row class="justify-content-center">
    function create_default_slot_1$l(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 8,
    				class: "text-white text-center",
    				$$slots: { default: [create_default_slot_2$l] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope, open*/ 5) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (17:1) <Container>
    function create_default_slot$l(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$l] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, open*/ 5) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$v(ctx) {
    	let section;
    	let div;
    	let t;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$l] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			div = element("div");
    			t = space();
    			create_component(container.$$.fragment);
    			attr(div, "class", "bg-overlay");
    			attr(section, "class", "section bg-home home-half common-section");
    			attr(section, "id", "home");
    			attr(section, "data-image-src", "images/bg-home.jpg");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div);
    			append(section, t);
    			mount_component(container, section, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope, open*/ 5) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let open = false;

    	/**
     * Toggle modal
     */
    	const toggle = () => {
    		$$invalidate(0, open = !open);
    	};

    	return [open, toggle];
    }

    class HomeSection$8 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$f, create_fragment$v, safe_not_equal, {});
    	}
    }

    /* src/Components/Client.svelte generated by Svelte v3.50.1 */

    function create_default_slot_5$9(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<img src="images/clients/1.png" alt="logo-img" class="mx-auto img-fluid d-block"/>`;
    			attr(div, "class", "client-images my-3 my-md-0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (14:3) <Col md={3}>
    function create_default_slot_4$g(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<img src="images/clients/2.png" alt="logo-img" class="mx-auto img-fluid d-block"/>`;
    			attr(div, "class", "client-images my-3 my-md-0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (20:3) <Col md={3}>
    function create_default_slot_3$h(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<img src="images/clients/3.png" alt="logo-img" class="mx-auto img-fluid d-block"/>`;
    			attr(div, "class", "client-images my-3 my-md-0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (26:3) <Col md={3}>
    function create_default_slot_2$k(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<img src="images/clients/4.png" alt="logo-img" class="mx-auto img-fluid d-block"/>`;
    			attr(div, "class", "client-images my-3 my-md-0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (7:2) <Row>
    function create_default_slot_1$k(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let t2;
    	let col3;
    	let current;

    	col0 = new Col({
    			props: {
    				md: 3,
    				$$slots: { default: [create_default_slot_5$9] },
    				$$scope: { ctx }
    			}
    		});

    	col1 = new Col({
    			props: {
    				md: 3,
    				$$slots: { default: [create_default_slot_4$g] },
    				$$scope: { ctx }
    			}
    		});

    	col2 = new Col({
    			props: {
    				md: 3,
    				$$slots: { default: [create_default_slot_3$h] },
    				$$scope: { ctx }
    			}
    		});

    	col3 = new Col({
    			props: {
    				md: 3,
    				$$slots: { default: [create_default_slot_2$k] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    			t2 = space();
    			create_component(col3.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(col3, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    			const col3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col3_changes.$$scope = { dirty, ctx };
    			}

    			col3.$set(col3_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			transition_in(col3.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			transition_out(col3.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach(t1);
    			destroy_component(col2, detaching);
    			if (detaching) detach(t2);
    			destroy_component(col3, detaching);
    		}
    	};
    }

    // (6:1) <Container>
    function create_default_slot$k(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$k] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$u(ctx) {
    	let section;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$k] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			create_component(container.$$.fragment);
    			attr(section, "class", "section-sm bg-light");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			mount_component(container, section, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    class Client extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$u, safe_not_equal, {});
    	}
    }

    /* src/Components/AboutUs.svelte generated by Svelte v3.50.1 */

    function create_default_slot_7$8(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<img src="images/page-speed-a5059a03.webp" alt="macbook_image" class="img-fluid"/>`;
    			attr(div, "class", "features-img mx-auto me-lg-0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (13:3) <Col lg={7} class="order-1 order-lg-2">
    function create_default_slot_6$8(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");

    			div.innerHTML = `<h3>Increase PageSpeed scores</h3> 
					<p class="text-muted web-desc">Get in the sweet +90’s score on Google page speed by meeting the core web vitals.</p> 
					<h4>Boost profits</h4> 
					<p class="text-muted web-desc">Website performance has a large, measurable effect on conversion rates. Studies have consistently shown that fast page speed will result in a better conversion rate.</p> 
					<h4>Improve search positioning</h4> 
					<p class="text-muted web-desc">Website speed have a huge impact on search ranking, but we also make sure your site is SEO friendly and meets all the accessibility criteria.</p> 
                <a href="${"#"}" class="btn btn-primary mt-4 waves-effect waves-light">Learn More <i class="mdi mdi-arrow-right"></i></a>`;

    			attr(div, "class", "features-box mt-5 mt-lg-0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (7:2) <Row class="align-items-center">
    function create_default_slot_5$8(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: 5,
    				class: "order-2 order-lg-1",
    				$$slots: { default: [create_default_slot_7$8] },
    				$$scope: { ctx }
    			}
    		});

    	col1 = new Col({
    			props: {
    				lg: 7,
    				class: "order-1 order-lg-2",
    				$$slots: { default: [create_default_slot_6$8] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach(t);
    			destroy_component(col1, detaching);
    		}
    	};
    }

    // (6:1) <Container>
    function create_default_slot_4$f(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "align-items-center",
    				$$slots: { default: [create_default_slot_5$8] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    // (38:3) <Col lg={5} class="order-2 order-lg-1">
    function create_default_slot_3$g(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");

    			div.innerHTML = `<h3>Start boosting your website performance</h3> 
					<p class="text-muted web-desc">Our team will take care of your site speed issues. They’ll audit your site and find any possible bottlenecks and work on any optimizations necessary.</p> 
					<p class="text-muted web-desc">If your site is in continuous development and you are worried about a new functionality slowing down your site, you can get into one of our monthly plans. This way our team can audit it again and re-optimize it to make sure it stays scoring high.</p> 
                <a href="${"#"}" class="btn btn-primary mt-4 waves-effect waves-light">See plans and pricing <i class="mdi mdi-arrow-right"></i></a>`;

    			attr(div, "class", "features-box mt-5 mt-lg-0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (52:3) <Col lg={7} class="order-1 order-lg-2">
    function create_default_slot_2$j(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<img src="images/img-block-6cd76f9d.webp" alt="macbook_image" class="img-fluid"/>`;
    			attr(div, "class", "features-img mx-auto me-lg-0");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (37:2) <Row class="align-items-center">
    function create_default_slot_1$j(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: 5,
    				class: "order-2 order-lg-1",
    				$$slots: { default: [create_default_slot_3$g] },
    				$$scope: { ctx }
    			}
    		});

    	col1 = new Col({
    			props: {
    				lg: 7,
    				class: "order-1 order-lg-2",
    				$$slots: { default: [create_default_slot_2$j] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach(t);
    			destroy_component(col1, detaching);
    		}
    	};
    }

    // (36:1) <Container>
    function create_default_slot$j(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "align-items-center",
    				$$slots: { default: [create_default_slot_1$j] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$t(ctx) {
    	let section0;
    	let container0;
    	let t;
    	let section1;
    	let container1;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_4$f] },
    				$$scope: { ctx }
    			}
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$j] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section0 = element("section");
    			create_component(container0.$$.fragment);
    			t = space();
    			section1 = element("section");
    			create_component(container1.$$.fragment);
    			attr(section0, "class", "section common-section");
    			attr(section0, "id", "features");
    		},
    		m(target, anchor) {
    			insert(target, section0, anchor);
    			mount_component(container0, section0, null);
    			insert(target, t, anchor);
    			insert(target, section1, anchor);
    			mount_component(container1, section1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section0);
    			destroy_component(container0);
    			if (detaching) detach(t);
    			if (detaching) detach(section1);
    			destroy_component(container1);
    		}
    	};
    }

    class AboutUs extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$t, safe_not_equal, {});
    	}
    }

    /* src/Components/Services.svelte generated by Svelte v3.50.1 */

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (16:3) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_7$7(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = `${/*heading*/ ctx[0]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr(h1, "class", "section-title text-center");
    			attr(div, "class", "section-title-border mt-3");
    			attr(p, "class", "section-subtitle text-muted text-center pt-4 font-secondary");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    			insert(target, t2, anchor);
    			insert(target, p, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    			if (detaching) detach(t2);
    			if (detaching) detach(p);
    		}
    	};
    }

    // (15:2) <Row>
    function create_default_slot_6$7(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_7$7] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (26:4) <Col lg={4} class="mt-4">
    function create_default_slot_5$7(ctx) {
    	let div2;
    	let div1;
    	let i;
    	let t0;
    	let div0;
    	let h4;
    	let t1_value = /*list*/ ctx[8].label + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*list*/ ctx[8].text + "";
    	let t3;
    	let t4;

    	return {
    		c() {
    			div2 = element("div");
    			div1 = element("div");
    			i = element("i");
    			t0 = space();
    			div0 = element("div");
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			attr(i, "class", "" + (/*list*/ ctx[8].icon + " text-primary"));
    			attr(p, "class", "pt-2 text-muted");
    			attr(div0, "class", "ms-4");
    			attr(div1, "class", "d-flex");
    			attr(div2, "class", "services-box");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, i);
    			append(div1, t0);
    			append(div1, div0);
    			append(div0, h4);
    			append(h4, t1);
    			append(div0, t2);
    			append(div0, p);
    			append(p, t3);
    			insert(target, t4, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div2);
    			if (detaching) detach(t4);
    		}
    	};
    }

    // (25:3) {#each services_list as list}
    function create_each_block$4(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 4,
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_5$7] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (24:2) <Row class="mt-5">
    function create_default_slot_4$e(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*services_list*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*services_list*/ 4) {
    				each_value = /*services_list*/ ctx[2];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (14:1) <Container>
    function create_default_slot_3$f(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_6$7] },
    				$$scope: { ctx }
    			}
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-5",
    				$$slots: { default: [create_default_slot_4$e] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach(t);
    			destroy_component(row1, detaching);
    		}
    	};
    }

    // (50:12) <Col lg={12} class="text-center">
    function create_default_slot_2$i(ctx) {
    	let h2;
    	let t1;
    	let p;
    	let t3;
    	let a;

    	return {
    		c() {
    			h2 = element("h2");
    			h2.textContent = `${/*title*/ ctx[3]}`;
    			t1 = space();
    			p = element("p");
    			p.textContent = `${/*text*/ ctx[5]}`;
    			t3 = space();
    			a = element("a");
    			a.textContent = `${/*buttontext*/ ctx[4]}`;
    			attr(h2, "class", "text-white");
    			attr(p, "class", "pt-3 home-desc mx-auto");
    			attr(a, "href", "#");
    			attr(a, "class", "btn btn-white mt-5 waves-effect waves-light");
    		},
    		m(target, anchor) {
    			insert(target, h2, anchor);
    			insert(target, t1, anchor);
    			insert(target, p, anchor);
    			insert(target, t3, anchor);
    			insert(target, a, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h2);
    			if (detaching) detach(t1);
    			if (detaching) detach(p);
    			if (detaching) detach(t3);
    			if (detaching) detach(a);
    		}
    	};
    }

    // (49:8) <Row>
    function create_default_slot_1$i(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 12,
    				class: "text-center",
    				$$slots: { default: [create_default_slot_2$i] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (48:4) <Container>
    function create_default_slot$i(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$i] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$s(ctx) {
    	let section0;
    	let container0;
    	let t0;
    	let section1;
    	let div;
    	let t1;
    	let container1;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_3$f] },
    				$$scope: { ctx }
    			}
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$i] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section0 = element("section");
    			create_component(container0.$$.fragment);
    			t0 = space();
    			section1 = element("section");
    			div = element("div");
    			t1 = space();
    			create_component(container1.$$.fragment);
    			attr(section0, "class", "section bg-light common-section");
    			attr(section0, "id", "services");
    			attr(div, "class", "bg-overlay");
    			attr(section1, "class", "section bg-web-desc");
    		},
    		m(target, anchor) {
    			insert(target, section0, anchor);
    			mount_component(container0, section0, null);
    			insert(target, t0, anchor);
    			insert(target, section1, anchor);
    			append(section1, div);
    			append(section1, t1);
    			mount_component(container1, section1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section0);
    			destroy_component(container0);
    			if (detaching) detach(t0);
    			if (detaching) detach(section1);
    			destroy_component(container1);
    		}
    	};
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { serviceData = {} } = $$props;
    	let { websiteData = {} } = $$props;
    	const { heading, description, services_list } = serviceData;
    	const { title, buttontext, text } = websiteData;

    	$$self.$$set = $$props => {
    		if ('serviceData' in $$props) $$invalidate(6, serviceData = $$props.serviceData);
    		if ('websiteData' in $$props) $$invalidate(7, websiteData = $$props.websiteData);
    	};

    	return [
    		heading,
    		description,
    		services_list,
    		title,
    		buttontext,
    		text,
    		serviceData,
    		websiteData
    	];
    }

    class Services extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$e, create_fragment$s, safe_not_equal, { serviceData: 6, websiteData: 7 });
    	}
    }

    /* src/Components/Team.svelte generated by Svelte v3.50.1 */

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:6) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_4$d(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p;

    	return {
    		c() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = `${/*title*/ ctx[0]}`;
    			t1 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr(p, "class", "text-muted pt-4");
    			attr(div, "class", "about-title mx-auto text-center");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h2);
    			append(div, t1);
    			append(div, p);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (12:4) <Row>
    function create_default_slot_3$e(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_4$d] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (24:8) <Col lg="3" sm="6">
    function create_default_slot_2$h(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h4;
    	let t1_value = /*list*/ ctx[4].name + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*list*/ ctx[4].designation + "";
    	let t3;
    	let t4;

    	return {
    		c() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			attr(img, "alt", "");
    			if (!src_url_equal(img.src, img_src_value = /*list*/ ctx[4].profile)) attr(img, "src", img_src_value);
    			attr(img, "class", "img-fluid rounded");
    			attr(div0, "class", "team-member");
    			attr(div1, "class", "team-wrapper");
    			attr(h4, "class", "team-name");
    			attr(p, "class", "text-uppercase team-designation");
    			attr(div2, "class", "team-box text-center");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div1);
    			append(div1, div0);
    			append(div0, img);
    			append(div2, t0);
    			append(div2, h4);
    			append(h4, t1);
    			append(div2, t2);
    			append(div2, p);
    			append(p, t3);
    			insert(target, t4, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div2);
    			if (detaching) detach(t4);
    		}
    	};
    }

    // (23:6) {#each team_list as list}
    function create_each_block$3(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "3",
    				sm: "6",
    				$$slots: { default: [create_default_slot_2$h] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (22:4) <Row class="mt-5">
    function create_default_slot_1$h(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*team_list*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*team_list*/ 4) {
    				each_value = /*team_list*/ ctx[2];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (11:2) <Container>
    function create_default_slot$h(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3$e] },
    				$$scope: { ctx }
    			}
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-5",
    				$$slots: { default: [create_default_slot_1$h] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach(t);
    			destroy_component(row1, detaching);
    		}
    	};
    }

    function create_fragment$r(ctx) {
    	let section;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$h] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			create_component(container.$$.fragment);
    			attr(section, "class", "section common-section");
    			attr(section, "id", "about");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			mount_component(container, section, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { teamData = {} } = $$props;
    	const { title, description, team_list } = teamData;

    	$$self.$$set = $$props => {
    		if ('teamData' in $$props) $$invalidate(3, teamData = $$props.teamData);
    	};

    	return [title, description, team_list, teamData];
    }

    class Team extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$d, create_fragment$r, safe_not_equal, { teamData: 3 });
    	}
    }

    /* src/Components/Pricing.svelte generated by Svelte v3.50.1 */

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (13:3) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_4$c(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = `${/*title*/ ctx[0]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr(h1, "class", "section-title text-center");
    			attr(div, "class", "section-title-border mt-3");
    			attr(p, "class", "section-subtitle font-secondary text-muted text-center pt-4");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    			insert(target, t2, anchor);
    			insert(target, p, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    			if (detaching) detach(t2);
    			if (detaching) detach(p);
    		}
    	};
    }

    // (12:2) <Row>
    function create_default_slot_3$d(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_4$c] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (25:6) {#if key === 1}
    function create_if_block(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");
    			div.innerHTML = `<span>Popular</span>`;
    			attr(div, "class", "ribbon-box");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (23:4) <Col lg={4}>
    function create_default_slot_2$g(ctx) {
    	let div1;
    	let t0;
    	let h4;
    	let t1_value = /*list*/ ctx[4].title + "";
    	let t1;
    	let t2;
    	let h1;
    	let t3_value = /*list*/ ctx[4].price + "";
    	let t3;
    	let t4;
    	let h6;
    	let t6;
    	let div0;
    	let p0;
    	let t7;
    	let b0;
    	let t8_value = /*list*/ ctx[4].bandwidth + "";
    	let t8;
    	let t9;
    	let p1;
    	let t10;
    	let b1;
    	let t11_value = /*list*/ ctx[4].onlinespace + "";
    	let t11;
    	let t12;
    	let p2;
    	let t13;
    	let b2;
    	let t14_value = /*list*/ ctx[4].support + "";
    	let t14;
    	let t15;
    	let p3;
    	let b3;
    	let t16_value = /*list*/ ctx[4].domain + "";
    	let t16;
    	let t17;
    	let t18;
    	let p4;
    	let b4;
    	let t19_value = /*list*/ ctx[4].hiddenfees + "";
    	let t19;
    	let t20;
    	let t21;
    	let a;
    	let t23;
    	let if_block = /*key*/ ctx[6] === 1 && create_if_block();

    	return {
    		c() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = space();
    			h1 = element("h1");
    			t3 = text(t3_value);
    			t4 = space();
    			h6 = element("h6");
    			h6.textContent = "Billing Per Month";
    			t6 = space();
    			div0 = element("div");
    			p0 = element("p");
    			t7 = text("Bandwidth: ");
    			b0 = element("b");
    			t8 = text(t8_value);
    			t9 = space();
    			p1 = element("p");
    			t10 = text("Onlinespace: ");
    			b1 = element("b");
    			t11 = text(t11_value);
    			t12 = space();
    			p2 = element("p");
    			t13 = text("Support: ");
    			b2 = element("b");
    			t14 = text(t14_value);
    			t15 = space();
    			p3 = element("p");
    			b3 = element("b");
    			t16 = text(t16_value);
    			t17 = text(" Domain");
    			t18 = space();
    			p4 = element("p");
    			b4 = element("b");
    			t19 = text(t19_value);
    			t20 = text(" Hidden Fees");
    			t21 = space();
    			a = element("a");
    			a.textContent = "GET IN TOUCH";
    			t23 = space();
    			attr(h4, "class", "text-uppercase");
    			attr(h6, "class", "text-uppercase text-muted");
    			attr(b0, "class", "text-primary");
    			attr(b1, "class", "text-primary");
    			attr(b2, "class", "text-primary");
    			attr(b3, "class", "text-primary");
    			attr(b4, "class", "text-primary");
    			attr(div0, "class", "plan-features mt-5");
    			attr(a, "href", '#');
    			attr(a, "class", "btn btn-primary waves-effect waves-light mt-5");

    			attr(div1, "class", /*key*/ ctx[6] === 1
    			? 'text-center pricing-box bg-white price-active'
    			: 'text-center pricing-box');
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append(div1, t0);
    			append(div1, h4);
    			append(h4, t1);
    			append(div1, t2);
    			append(div1, h1);
    			append(h1, t3);
    			append(div1, t4);
    			append(div1, h6);
    			append(div1, t6);
    			append(div1, div0);
    			append(div0, p0);
    			append(p0, t7);
    			append(p0, b0);
    			append(b0, t8);
    			append(div0, t9);
    			append(div0, p1);
    			append(p1, t10);
    			append(p1, b1);
    			append(b1, t11);
    			append(div0, t12);
    			append(div0, p2);
    			append(p2, t13);
    			append(p2, b2);
    			append(b2, t14);
    			append(div0, t15);
    			append(div0, p3);
    			append(p3, b3);
    			append(b3, t16);
    			append(p3, t17);
    			append(div0, t18);
    			append(div0, p4);
    			append(p4, b4);
    			append(b4, t19);
    			append(p4, t20);
    			append(div1, t21);
    			append(div1, a);
    			insert(target, t23, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (if_block) if_block.d();
    			if (detaching) detach(t23);
    		}
    	};
    }

    // (22:3) {#each pricing_list as list,key}
    function create_each_block$2(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 4,
    				$$slots: { default: [create_default_slot_2$g] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (21:2) <Row class="mt-5">
    function create_default_slot_1$g(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*pricing_list*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*pricing_list*/ 4) {
    				each_value = /*pricing_list*/ ctx[2];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (11:1) <Container>
    function create_default_slot$g(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3$d] },
    				$$scope: { ctx }
    			}
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-5",
    				$$slots: { default: [create_default_slot_1$g] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach(t);
    			destroy_component(row1, detaching);
    		}
    	};
    }

    function create_fragment$q(ctx) {
    	let section;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$g] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			create_component(container.$$.fragment);
    			attr(section, "class", "section bg-light common-section");
    			attr(section, "id", "pricing");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			mount_component(container, section, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { pricingData = {} } = $$props;
    	const { title, description, pricing_list } = pricingData;

    	$$self.$$set = $$props => {
    		if ('pricingData' in $$props) $$invalidate(3, pricingData = $$props.pricingData);
    	};

    	return [title, description, pricing_list, pricingData];
    }

    class Pricing extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$c, create_fragment$q, safe_not_equal, { pricingData: 3 });
    	}
    }

    /* src/Components/Testimonial.svelte generated by Svelte v3.50.1 */

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (17:3) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_7$6(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = `${/*title*/ ctx[0]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr(h1, "class", "section-title text-center");
    			attr(div, "class", "section-title-border mt-3");
    			attr(p, "class", "section-subtitle text-muted text-center font-secondary pt-4");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    			insert(target, t2, anchor);
    			insert(target, p, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    			if (detaching) detach(t2);
    			if (detaching) detach(p);
    		}
    	};
    }

    // (16:2) <Row>
    function create_default_slot_6$6(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_7$6] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (27:4) <Col lg={4}>
    function create_default_slot_5$6(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div1;
    	let h5;
    	let t2_value = /*list*/ ctx[8].name + "";
    	let t2;
    	let span;
    	let t3_value = /*list*/ ctx[8].text + "";
    	let t3;
    	let t4;
    	let p;
    	let t5;
    	let t6_value = /*list*/ ctx[8].description + "";
    	let t6;
    	let t7;
    	let t8;

    	return {
    		c() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			div0.innerHTML = `<i class="mdi mdi-format-quote-open display-1"></i>`;
    			t0 = space();
    			img = element("img");
    			t1 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t2 = text(t2_value);
    			span = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text("“");
    			t6 = text(t6_value);
    			t7 = text("”");
    			t8 = space();
    			attr(div0, "class", "testi-icon");
    			if (!src_url_equal(img.src, img_src_value = /*list*/ ctx[8].profile)) attr(img, "src", img_src_value);
    			attr(img, "alt", "");
    			attr(img, "class", "img-fluid mx-auto d-block img-thumbnail rounded-circle mb-4");
    			attr(span, "class", "text-muted text-capitalize");
    			attr(h5, "class", "text-center text-uppercase mb-3");
    			attr(p, "class", "text-muted text-center mb-0");
    			attr(div1, "class", "p-1");
    			attr(div2, "class", "testimonial-decs p-4");
    			attr(div3, "class", "testimonial-box mt-4");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div0);
    			append(div2, t0);
    			append(div2, img);
    			append(div2, t1);
    			append(div2, div1);
    			append(div1, h5);
    			append(h5, t2);
    			append(h5, span);
    			append(span, t3);
    			append(div1, t4);
    			append(div1, p);
    			append(p, t5);
    			append(p, t6);
    			append(p, t7);
    			insert(target, t8, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div3);
    			if (detaching) detach(t8);
    		}
    	};
    }

    // (26:3) {#each testimonial_list as list}
    function create_each_block$1(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 4,
    				$$slots: { default: [create_default_slot_5$6] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (25:2) <Row class="mt-5">
    function create_default_slot_4$b(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*testimonial_list*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*testimonial_list*/ 4) {
    				each_value = /*testimonial_list*/ ctx[2];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (15:1) <Container>
    function create_default_slot_3$c(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_6$6] },
    				$$scope: { ctx }
    			}
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-5",
    				$$slots: { default: [create_default_slot_4$b] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach(t);
    			destroy_component(row1, detaching);
    		}
    	};
    }

    // (59:12) <Col lg={{size:8, offset: 2}} class="text-center">
    function create_default_slot_2$f(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;
    	let t4;
    	let a;
    	let t5;
    	let t6;
    	let i;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = `${/*newtitle*/ ctx[3]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*newtext*/ ctx[4]}`;
    			t4 = space();
    			a = element("a");
    			t5 = text(/*newbuttontext*/ ctx[5]);
    			t6 = space();
    			i = element("i");
    			attr(h1, "class", "get-started-title text-white");
    			attr(div, "class", "section-title-border mt-4 bg-white");
    			attr(p, "class", "section-subtitle font-secondary text-white text-center pt-4");
    			attr(i, "class", "mdi mdi-arrow-right");
    			attr(a, "href", "#");
    			attr(a, "class", "btn btn-white waves-effect mt-4");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    			insert(target, t2, anchor);
    			insert(target, p, anchor);
    			insert(target, t4, anchor);
    			insert(target, a, anchor);
    			append(a, t5);
    			append(a, t6);
    			append(a, i);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    			if (detaching) detach(t2);
    			if (detaching) detach(p);
    			if (detaching) detach(t4);
    			if (detaching) detach(a);
    		}
    	};
    }

    // (58:8) <Row>
    function create_default_slot_1$f(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				class: "text-center",
    				$$slots: { default: [create_default_slot_2$f] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (57:4) <Container>
    function create_default_slot$f(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$f] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$p(ctx) {
    	let section0;
    	let container0;
    	let t0;
    	let section1;
    	let div;
    	let t1;
    	let container1;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_3$c] },
    				$$scope: { ctx }
    			}
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section0 = element("section");
    			create_component(container0.$$.fragment);
    			t0 = space();
    			section1 = element("section");
    			div = element("div");
    			t1 = space();
    			create_component(container1.$$.fragment);
    			attr(section0, "class", "section");
    			attr(section0, "id", "testi");
    			attr(div, "class", "bg-overlay");
    			attr(section1, "class", "section section-lg bg-get-start");
    		},
    		m(target, anchor) {
    			insert(target, section0, anchor);
    			mount_component(container0, section0, null);
    			insert(target, t0, anchor);
    			insert(target, section1, anchor);
    			append(section1, div);
    			append(section1, t1);
    			mount_component(container1, section1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section0);
    			destroy_component(container0);
    			if (detaching) detach(t0);
    			if (detaching) detach(section1);
    			destroy_component(container1);
    		}
    	};
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { testimonialData = {} } = $$props;
    	const { title, description, testimonial_list } = testimonialData;
    	let { startedData = {} } = $$props;
    	const { newtitle, newtext, newbuttontext } = startedData;

    	$$self.$$set = $$props => {
    		if ('testimonialData' in $$props) $$invalidate(6, testimonialData = $$props.testimonialData);
    		if ('startedData' in $$props) $$invalidate(7, startedData = $$props.startedData);
    	};

    	return [
    		title,
    		description,
    		testimonial_list,
    		newtitle,
    		newtext,
    		newbuttontext,
    		testimonialData,
    		startedData
    	];
    }

    class Testimonial extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$b, create_fragment$p, safe_not_equal, { testimonialData: 6, startedData: 7 });
    	}
    }

    /* src/Components/Blog.svelte generated by Svelte v3.50.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (12:3) <Col lg={{ size: 8, offset: 2 }}>
    function create_default_slot_4$a(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = `${/*title*/ ctx[0]}`;
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*description*/ ctx[1]}`;
    			attr(h1, "class", "section-title text-center");
    			attr(div, "class", "section-title-border mt-3");
    			attr(p, "class", "section-subtitle text-muted text-center font-secondary pt-4");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    			insert(target, t2, anchor);
    			insert(target, p, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    			if (detaching) detach(t2);
    			if (detaching) detach(p);
    		}
    	};
    }

    // (11:2) <Row>
    function create_default_slot_3$b(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_4$a] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (23:4) <Col lg="4">
    function create_default_slot_2$e(ctx) {
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h5;
    	let t1_value = /*list*/ ctx[4].text + "";
    	let t1;
    	let t2;
    	let h4;
    	let a0;
    	let t3_value = /*list*/ ctx[4].title + "";
    	let t3;
    	let t4;
    	let p;
    	let t5_value = /*list*/ ctx[4].subtext + "";
    	let t5;
    	let t6;
    	let div0;
    	let t8;

    	return {
    		c() {
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t1 = text(t1_value);
    			t2 = space();
    			h4 = element("h4");
    			a0 = element("a");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			div0 = element("div");
    			div0.innerHTML = `<a href="${'#'}" class="read-btn">Read More <i class="mdi mdi-arrow-right"></i></a>`;
    			t8 = space();
    			if (!src_url_equal(img.src, img_src_value = /*list*/ ctx[4].image)) attr(img, "src", img_src_value);
    			attr(img, "class", "img-fluid");
    			attr(img, "alt", "");
    			attr(h5, "class", "mt-4 text-muted");
    			attr(a0, "href", '#');
    			attr(a0, "class", "blog-title");
    			attr(h4, "class", "mt-3");
    			attr(p, "class", "text-muted");
    			attr(div0, "class", "mt-3");
    			attr(div2, "class", "blog-box mt-4 hover-effect");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, img);
    			append(div2, t0);
    			append(div2, div1);
    			append(div1, h5);
    			append(h5, t1);
    			append(div1, t2);
    			append(div1, h4);
    			append(h4, a0);
    			append(a0, t3);
    			append(div1, t4);
    			append(div1, p);
    			append(p, t5);
    			append(div1, t6);
    			append(div1, div0);
    			insert(target, t8, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div2);
    			if (detaching) detach(t8);
    		}
    	};
    }

    // (22:3) {#each blog_list as list}
    function create_each_block(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "4",
    				$$slots: { default: [create_default_slot_2$e] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (21:2) <Row class="mt-4">
    function create_default_slot_1$e(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*blog_list*/ ctx[2];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*blog_list*/ 4) {
    				each_value = /*blog_list*/ ctx[2];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (10:1) <Container>
    function create_default_slot$e(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3$b] },
    				$$scope: { ctx }
    			}
    		});

    	row1 = new Row({
    			props: {
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_1$e] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach(t);
    			destroy_component(row1, detaching);
    		}
    	};
    }

    function create_fragment$o(ctx) {
    	let section;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			create_component(container.$$.fragment);
    			attr(section, "class", "section bg-light");
    			attr(section, "id", "blog");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			mount_component(container, section, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { blogData = {} } = $$props;
    	const { title, description, blog_list } = blogData;

    	$$self.$$set = $$props => {
    		if ('blogData' in $$props) $$invalidate(3, blogData = $$props.blogData);
    	};

    	return [title, description, blog_list, blogData];
    }

    class Blog extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$a, create_fragment$o, safe_not_equal, { blogData: 3 });
    	}
    }

    /* src/Components/Contact.svelte generated by Svelte v3.50.1 */

    function create_default_slot_18(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let t2;
    	let p;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = "Get In Touch";
    			t1 = space();
    			div = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = "We thrive when coming up with innovative ideas but also understand\n          that a smart concept should be supported with faucibus sapien odio\n          measurable results.";
    			attr(h1, "class", "section-title text-center");
    			attr(div, "class", "section-title-border mt-3");
    			attr(p, "class", "section-subtitle text-muted text-center font-secondary pt-4");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    			insert(target, t2, anchor);
    			insert(target, p, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    			if (detaching) detach(t2);
    			if (detaching) detach(p);
    		}
    	};
    }

    // (9:4) <Row>
    function create_default_slot_17(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: { size: 8, offset: 2 },
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (21:6) <Col lg="4">
    function create_default_slot_16(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");

    			div.innerHTML = `<p class="mt-4"><span class="h5">Office Address 1:</span><br/> 
            <span class="text-muted d-block mt-2">Lorem ipsun 123</span></p> 
          <p class="mt-4"><span class="h5">Office Address 2:</span><br/> 
            <span class="text-muted d-block mt-2">Lorem ipsun <br/>123</span></p> 
          <p class="mt-4"><span class="h5">Working Hours:</span><br/> 
            <span class="text-muted d-block mt-2">9:00AM To 6:00PM</span></p>`;

    			attr(div, "class", "mt-4 pt-4");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (44:16) <FormGroup class="mt-2">
    function create_default_slot_15(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				name: "name",
    				id: "name",
    				type: "text",
    				class: "form-control",
    				placeholder: "Your name*"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (43:14) <Col lg="6">
    function create_default_slot_14(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				class: "mt-2",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(formgroup.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};
    }

    // (55:16) <FormGroup class="mt-2">
    function create_default_slot_13(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				name: "email",
    				id: "email",
    				type: "email",
    				class: "form-control",
    				placeholder: "Your email*"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (54:14) <Col lg="6">
    function create_default_slot_12$3(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				class: "mt-2",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(formgroup.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};
    }

    // (42:12) <Row>
    function create_default_slot_11$3(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "6",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			}
    		});

    	col1 = new Col({
    			props: {
    				lg: "6",
    				$$slots: { default: [create_default_slot_12$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach(t);
    			destroy_component(col1, detaching);
    		}
    	};
    }

    // (68:16) <FormGroup class="mt-2">
    function create_default_slot_10$3(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "text",
    				class: "form-control",
    				id: "subject",
    				name: "subject",
    				placeholder: "Your Subject.."
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (67:14) <Col lg="12">
    function create_default_slot_9$3(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				class: "mt-2",
    				$$slots: { default: [create_default_slot_10$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(formgroup.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};
    }

    // (66:12) <Row>
    function create_default_slot_8$5(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "12",
    				$$slots: { default: [create_default_slot_9$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (81:16) <FormGroup class="mt-2">
    function create_default_slot_7$5(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "textarea",
    				name: "comments",
    				id: "comments",
    				rows: "4",
    				class: "form-control",
    				placeholder: "Your message..."
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (80:14) <Col lg="12">
    function create_default_slot_6$5(ctx) {
    	let formgroup;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				class: "mt-2",
    				$$slots: { default: [create_default_slot_7$5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(formgroup.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formgroup.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formgroup, detaching);
    		}
    	};
    }

    // (79:12) <Row>
    function create_default_slot_5$5(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "12",
    				$$slots: { default: [create_default_slot_6$5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (94:14) <Col lg="12" class="text-end">
    function create_default_slot_4$9(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				type: "submit",
    				id: "submit",
    				name: "send",
    				class: "submitBnt btn btn-primary",
    				value: "Send Message"
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (93:12) <Row>
    function create_default_slot_3$a(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "12",
    				class: "text-end",
    				$$slots: { default: [create_default_slot_4$9] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (37:6) <Col lg="8">
    function create_default_slot_2$d(ctx) {
    	let div1;
    	let form;
    	let p;
    	let t0;
    	let div0;
    	let t1;
    	let row0;
    	let t2;
    	let row1;
    	let t3;
    	let row2;
    	let t4;
    	let row3;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_11$3] },
    				$$scope: { ctx }
    			}
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_8$5] },
    				$$scope: { ctx }
    			}
    		});

    	row2 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_5$5] },
    				$$scope: { ctx }
    			}
    		});

    	row3 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_3$a] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div1 = element("div");
    			form = element("form");
    			p = element("p");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			create_component(row0.$$.fragment);
    			t2 = space();
    			create_component(row1.$$.fragment);
    			t3 = space();
    			create_component(row2.$$.fragment);
    			t4 = space();
    			create_component(row3.$$.fragment);
    			attr(p, "id", "error-msg");
    			attr(div0, "id", "simple-msg");
    			attr(form, "method", "post");
    			attr(form, "name", "myForm");
    			attr(form, "onsubmit", "return validateForm()");
    			attr(div1, "class", "custom-form mt-4 pt-4");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, form);
    			append(form, p);
    			append(form, t0);
    			append(form, div0);
    			append(form, t1);
    			mount_component(row0, form, null);
    			append(form, t2);
    			mount_component(row1, form, null);
    			append(form, t3);
    			mount_component(row2, form, null);
    			append(form, t4);
    			mount_component(row3, form, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    			const row2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row2_changes.$$scope = { dirty, ctx };
    			}

    			row2.$set(row2_changes);
    			const row3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row3_changes.$$scope = { dirty, ctx };
    			}

    			row3.$set(row3_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			transition_in(row2.$$.fragment, local);
    			transition_in(row3.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			transition_out(row2.$$.fragment, local);
    			transition_out(row3.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			destroy_component(row0);
    			destroy_component(row1);
    			destroy_component(row2);
    			destroy_component(row3);
    		}
    	};
    }

    // (20:4) <Row>
    function create_default_slot_1$d(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "4",
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			}
    		});

    	col1 = new Col({
    			props: {
    				lg: "8",
    				$$slots: { default: [create_default_slot_2$d] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach(t);
    			destroy_component(col1, detaching);
    		}
    	};
    }

    // (8:2) <Container>
    function create_default_slot$d(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			}
    		});

    	row1 = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$d] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach(t);
    			destroy_component(row1, detaching);
    		}
    	};
    }

    function create_fragment$n(ctx) {
    	let section;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			create_component(container.$$.fragment);
    			attr(section, "class", "section common-section");
    			attr(section, "id", "contact");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			mount_component(container, section, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    class Contact extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$n, safe_not_equal, {});
    	}
    }

    /* src/Components/Footer.svelte generated by Svelte v3.50.1 */

    function create_default_slot_8$4(ctx) {
    	let h4;
    	let t1;
    	let div;

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "HIRIC";
    			t1 = space();
    			div = element("div");

    			div.innerHTML = `<ul class="list-unstyled footer-list"><li><a href="${'#'}">Home</a></li> 
						<li><a href="${'#'}">About us</a></li> 
						<li><a href="${'#'}">Careers</a></li> 
						<li><a href="${'#'}">Contact us</a></li></ul>`;

    			attr(div, "class", "text-muted mt-4");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    		}
    	};
    }

    // (21:3) <Col lg="3" class="mt-4">
    function create_default_slot_7$4(ctx) {
    	let h4;
    	let t1;
    	let div;

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Information";
    			t1 = space();
    			div = element("div");

    			div.innerHTML = `<ul class="list-unstyled footer-list"><li><a href="${'#'}">Terms &amp; Condition</a></li> 
						<li><a href="${'#'}">About us</a></li> 
						<li><a href="${'#'}">Jobs</a></li> 
						<li><a href="${'#'}">Bookmarks</a></li></ul>`;

    			attr(div, "class", "text-muted mt-4");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    		}
    	};
    }

    // (32:3) <Col lg="3" class="mt-4">
    function create_default_slot_6$4(ctx) {
    	let h4;
    	let t1;
    	let div;

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Support";
    			t1 = space();
    			div = element("div");

    			div.innerHTML = `<ul class="list-unstyled footer-list"><li><a href="${'#'}">FAQ</a></li> 
						<li><a href="${'#'}">Contact</a></li> 
						<li><a href="${'#'}">Disscusion</a></li></ul>`;

    			attr(div, "class", "text-muted mt-4");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    		}
    	};
    }

    // (42:3) <Col lg="3" class="mt-4">
    function create_default_slot_5$4(ctx) {
    	let h4;
    	let t1;
    	let div;
    	let t3;
    	let form;

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Subscribe";
    			t1 = space();
    			div = element("div");

    			div.innerHTML = `<p>In an ideal world this text wouldn’t exist, a client would acknowledge the importance of having
						web copy before the design starts.</p>`;

    			t3 = space();
    			form = element("form");

    			form.innerHTML = `<input placeholder="Email" class="form-control" required=""/> 
					<a href="${'#'}" class="submit"><i class="pe-7s-paper-plane"></i></a>`;

    			attr(div, "class", "text-muted mt-4");
    			attr(form, "class", "form subscribe");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, div, anchor);
    			insert(target, t3, anchor);
    			insert(target, form, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(div);
    			if (detaching) detach(t3);
    			if (detaching) detach(form);
    		}
    	};
    }

    // (9:2) <Row>
    function create_default_slot_4$8(ctx) {
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let t2;
    	let col3;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_8$4] },
    				$$scope: { ctx }
    			}
    		});

    	col1 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_7$4] },
    				$$scope: { ctx }
    			}
    		});

    	col2 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_6$4] },
    				$$scope: { ctx }
    			}
    		});

    	col3 = new Col({
    			props: {
    				lg: "3",
    				class: "mt-4",
    				$$slots: { default: [create_default_slot_5$4] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col0.$$.fragment);
    			t0 = space();
    			create_component(col1.$$.fragment);
    			t1 = space();
    			create_component(col2.$$.fragment);
    			t2 = space();
    			create_component(col3.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(col1, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(col2, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(col3, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    			const col2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col2_changes.$$scope = { dirty, ctx };
    			}

    			col2.$set(col2_changes);
    			const col3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col3_changes.$$scope = { dirty, ctx };
    			}

    			col3.$set(col3_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			transition_in(col2.$$.fragment, local);
    			transition_in(col3.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			transition_out(col2.$$.fragment, local);
    			transition_out(col3.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach(t0);
    			destroy_component(col1, detaching);
    			if (detaching) detach(t1);
    			destroy_component(col2, detaching);
    			if (detaching) detach(t2);
    			destroy_component(col3, detaching);
    		}
    	};
    }

    // (8:1) <Container>
    function create_default_slot_3$9(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_4$8] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    // (64:3) <Col lg="12">
    function create_default_slot_2$c(ctx) {
    	let div0;
    	let p;
    	let t2;
    	let div1;
    	let t7;
    	let div2;

    	return {
    		c() {
    			div0 = element("div");
    			p = element("p");

    			p.textContent = `${new Date().getFullYear()}
						© Hiric - Themesbrand`;

    			t2 = space();
    			div1 = element("div");

    			div1.innerHTML = `<ul class="list-inline d-flex flex-wrap social m-0"><li class="list-inline-item"><a href="${"#"}" class="social-icon"><i class="mdi mdi-facebook"></i></a></li> 
						<li class="list-inline-item"><a href="${"#"}" class="social-icon"><i class="mdi mdi-twitter"></i></a></li> 
						<li class="list-inline-item"><a href="${"#"}" class="social-icon"><i class="mdi mdi-linkedin"></i></a></li> 
						<li class="list-inline-item"><a href="${"#"}" class="social-icon"><i class="mdi mdi-google-plus"></i></a></li> 
						<li class="list-inline-item"><a href="${"#"}" class="social-icon"><i class="mdi mdi-microsoft-xbox"></i></a></li></ul>`;

    			t7 = space();
    			div2 = element("div");
    			attr(p, "class", "copy-rights text-muted mb-3 mb-sm-0");
    			attr(div0, "class", "float-start pull-none ");
    			attr(div1, "class", "float-end pull-none ");
    			attr(div2, "class", "clearfix");
    		},
    		m(target, anchor) {
    			insert(target, div0, anchor);
    			append(div0, p);
    			insert(target, t2, anchor);
    			insert(target, div1, anchor);
    			insert(target, t7, anchor);
    			insert(target, div2, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div0);
    			if (detaching) detach(t2);
    			if (detaching) detach(div1);
    			if (detaching) detach(t7);
    			if (detaching) detach(div2);
    		}
    	};
    }

    // (63:2) <Row>
    function create_default_slot_1$c(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: "12",
    				$$slots: { default: [create_default_slot_2$c] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (62:1) <Container>
    function create_default_slot$c(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot_1$c] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$m(ctx) {
    	let footer;
    	let container0;
    	let t;
    	let div;
    	let container1;
    	let current;

    	container0 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_3$9] },
    				$$scope: { ctx }
    			}
    		});

    	container1 = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			footer = element("footer");
    			create_component(container0.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(container1.$$.fragment);
    			attr(footer, "class", "footer");
    			attr(div, "class", "footer-alt");
    		},
    		m(target, anchor) {
    			insert(target, footer, anchor);
    			mount_component(container0, footer, null);
    			insert(target, t, anchor);
    			insert(target, div, anchor);
    			mount_component(container1, div, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(footer);
    			destroy_component(container0);
    			if (detaching) detach(t);
    			if (detaching) detach(div);
    			destroy_component(container1);
    		}
    	};
    }

    class Footer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$m, safe_not_equal, {});
    	}
    }

    /* src/Components/Switcher.svelte generated by Svelte v3.50.1 */

    function create_fragment$l(ctx) {
    	let div2;
    	let div0;
    	let h3;
    	let t1;
    	let ul;
    	let li0;
    	let a0;
    	let t2;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t4;
    	let li3;
    	let a3;
    	let t5;
    	let li4;
    	let a4;
    	let t6;
    	let li5;
    	let a5;
    	let t7;
    	let li6;
    	let a6;
    	let t8;
    	let li7;
    	let a7;
    	let t9;
    	let div1;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Select your color";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			t2 = space();
    			li1 = element("li");
    			a1 = element("a");
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			t4 = space();
    			li3 = element("li");
    			a3 = element("a");
    			t5 = space();
    			li4 = element("li");
    			a4 = element("a");
    			t6 = space();
    			li5 = element("li");
    			a5 = element("a");
    			t7 = space();
    			li6 = element("li");
    			a6 = element("a");
    			t8 = space();
    			li7 = element("li");
    			a7 = element("a");
    			t9 = space();
    			div1 = element("div");
    			div1.innerHTML = `<a href="${'#'}" class="settings rounded-right"><i class="mdi mdi-cog mdi-spin"></i></a>`;
    			attr(a0, "class", "color1");
    			attr(a0, "href", '#');
    			attr(a1, "class", "color2");
    			attr(a1, "href", '#');
    			attr(a2, "class", "color3");
    			attr(a2, "href", '#');
    			attr(a3, "class", "color4");
    			attr(a3, "href", '#');
    			attr(a4, "class", "color5");
    			attr(a4, "href", '#');
    			attr(a5, "class", "color6");
    			attr(a5, "href", '#');
    			attr(a6, "class", "color7");
    			attr(a6, "href", '#');
    			attr(a7, "class", "color8");
    			attr(a7, "href", '#');
    			attr(ul, "class", "pattern");
    			attr(div1, "class", "bottom");
    			attr(div2, "id", "style-switcher");
    			set_style(div2, "left", "-189px");
    		},
    		m(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, h3);
    			append(div0, t1);
    			append(div0, ul);
    			append(ul, li0);
    			append(li0, a0);
    			append(ul, t2);
    			append(ul, li1);
    			append(li1, a1);
    			append(ul, t3);
    			append(ul, li2);
    			append(li2, a2);
    			append(ul, t4);
    			append(ul, li3);
    			append(li3, a3);
    			append(ul, t5);
    			append(ul, li4);
    			append(li4, a4);
    			append(ul, t6);
    			append(ul, li5);
    			append(li5, a5);
    			append(ul, t7);
    			append(ul, li6);
    			append(li6, a6);
    			append(ul, t8);
    			append(ul, li7);
    			append(li7, a7);
    			append(div2, t9);
    			append(div2, div1);

    			if (!mounted) {
    				dispose = [
    					listen(a0, "click", prevent_default(/*click_handler*/ ctx[1])),
    					listen(a1, "click", prevent_default(/*click_handler_1*/ ctx[2])),
    					listen(a2, "click", prevent_default(/*click_handler_2*/ ctx[3])),
    					listen(a3, "click", prevent_default(/*click_handler_3*/ ctx[4])),
    					listen(a4, "click", prevent_default(/*click_handler_4*/ ctx[5])),
    					listen(a5, "click", prevent_default(/*click_handler_5*/ ctx[6])),
    					listen(a6, "click", prevent_default(/*click_handler_6*/ ctx[7])),
    					listen(a7, "click", prevent_default(/*click_handler_7*/ ctx[8])),
    					listen(div2, "click", /*toggleSwitcher*/ ctx[0])
    				];

    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d(detaching) {
    			if (detaching) detach(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function setColor(el) {
    	document.getElementById('color-opt').href = '/css/colors/' + el + '.css';
    }

    function instance$9($$self) {
    	const toggleSwitcher = () => {
    		var i = document.getElementById('style-switcher');

    		if (i.style.left === '-189px') {
    			i.style.left = '0px';
    		} else {
    			i.style.left = '-189px';
    		}
    	};

    	const click_handler = () => setColor('cyan');
    	const click_handler_1 = () => setColor('red');
    	const click_handler_2 = () => setColor('green');
    	const click_handler_3 = () => setColor('pink');
    	const click_handler_4 = () => setColor('blue');
    	const click_handler_5 = () => setColor('purple');
    	const click_handler_6 = () => setColor('orange');
    	const click_handler_7 = () => setColor('yellow');

    	return [
    		toggleSwitcher,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7
    	];
    }

    class Switcher extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$9, create_fragment$l, safe_not_equal, {});
    	}
    }

    const SERVICE_DATA = {
        heading: "Website optimization is very important",
        
        description: "Experts are convinced it’s crucial for any online business, startup or blog success.",
        services_list: [{
                key: 1,
                label: "Improved Speed and Experience on Your Website",
                text: "The more time your site takes to load, the more likely visitors are going to leave your site, improve your site speed and let them enjoy their stay.",
                icon: "pe-7s-gleam"
            },
            {
                key: 2,
                label: "Fast website",
                text: "Credibly brand standards compliant users without extensible services. Anibh euismod tincidunt laoreet Ipsum passage.",
                icon: "pe-7s-timer"
            },
            {
                key: 3,
                label: "Strategy Solutions",
                text: "It goes without saying that a faster website equals more sales. Don’t let a slow website cost your business.",
                icon: "pe-7s-gleam"
            },
        ]
    };

    const FEATURES_DATA = {
        title: 'A digital web design studio creating modern & engaging online',
        text: 'Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.',
        feature_list: [
            'We put a lot of effort in design.',
            'The most important ingredient of successful website.',
            'Submit Your Orgnization.'
        ]
    };

    const WEBSITE_DESCRIPTION = {
        title: 'Build your dream website today',
        text: 'But nothing the copy said could convince her and so it didn’t take long until a few insidious Copy Writers ambushed her.',
        buttontext: 'View Plan & Pricing'
    };

    const PRICING_DATA = {
        title: 'Our Pricing',
        description: 'Call to action pricing table is really crucial to your for your business website. Make your bids stand-out with amazing options.',
        pricing_list: [
            {
                title: 'BASIC',
                price: '$1000',
                bandwidth: '1GB',
                onlinespace: '50MB',
                support: 'No',
                domain: 1,
                hiddenfees: 'No'
            },
            {
                title: 'PRO',
                price: '$2000',
                bandwidth: '10GB',
                onlinespace: '500MB',
                support: 'Yes',
                domain: 10,
                hiddenfees: 'No'
            },
            {
                title: 'ULTIMATE',
                price: '$29.90',
                bandwidth: '100GB',
                onlinespace: '2 GB',
                support: 'Yes',
                domain: 'Unlimited',
                hiddenfees: 'No'
            }
        ]
    };

    const TEAM_DATA = {
            title: 'A Digital web studio creating stunning & Engaging online Experiences',
            description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nasceturridiculus mus donec various versions have evolved quam felis.',
            team_list: [
                {
                    profile: '/images/team/img-1.jpg',
                    name: 'Frank Johnson',
                    designation: 'CEO'
                },
                {
                    profile: '/images/team/img-2.jpg',
                    name: 'Elaine Stclair',
                    designation: 'Designer'
                },
                {
                    profile: '/images/team/img-3.jpg',
                    name: 'Wanda Arthur',
                    designation: 'Developer'
                },
                {
                    profile: '/images/team/img-4.jpg',
                    name: 'Joshua Stemple',
                    designation: 'Manager'
                }
            ]
    };

    const TESATIMONIAL_DATA = {
        title :"What they've said",
        description: "The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli.",
        testimonial_list: [
            {
                profile: 'images/testimonials/user-1.jpg',
                description: "I feel confident imposing change on myself. It's a lot more fun progressing than looking back. That's why I ultricies enim at malesuada nibh diam on tortor neaded to throw curve balls.",
                name: 'Dennis Williams - ',
                text: 'Charleston'
            },
            {
                profile: 'images/testimonials/user-2.jpg',
                description: "Our task must be to free ourselves by widening our circle of compassion to embrace all living creatures and the whole of quis consectetur nunc sit amet semper justo.nature and its beauty.",
                name: 'Laurie Bell - ',
                text: 'Worcester'
            },
            {
                profile: 'images/testimonials/user-3.jpg',
                description: "I've learned that people will forget what you said, people will forget what you did,but people will never forget how donec in efficitur lectus, nec lobortis metus you made them feel.",
                name: 'Howard Kelley - ',
                text: 'Lynchburg'
            }
        ]
    };

    const GET_STARTED = {
        newtitle: "Let's Get Started",
        newtext: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
        newbuttontext: 'Get Started'
    };

    const BLOG_DATA = {
        title :'Latest News',
        description: 'Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean class at a euismod mus luctus quam.',
        blog_list:[
            {
                image: 'images/blog/img-1.jpg',
                text: 'UI & UX Design',
                title: 'Doing a cross country road trip',
                subtext: 'She packed her seven versalia, put her initial into the belt and made herself on the way..'
            },
            {
                image: 'images/blog/img-2.jpg',
                text: 'Digital Marketing',
                title: 'New exhibition at our Museum',
                subtext: 'Pityful a rethoric question ran over her cheek, then she continued her way.'
            },
            {
                image: 'images/blog/img-3.jpg',
                text: 'Travelling',
                title: 'Why are so many people..',
                subtext: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.'
            }
        ]
    };

    const MOCK_DATA = {
        SERVICE_DATA,
        FEATURES_DATA,
        GET_STARTED,
        WEBSITE_DESCRIPTION,
        PRICING_DATA,
        TEAM_DATA,
        TESATIMONIAL_DATA,
        BLOG_DATA
    };

    /* src/routes/Layout1/Layout_1.svelte generated by Svelte v3.50.1 */

    function create_fragment$k(ctx) {
    	let navbar;
    	let t0;
    	let homesection;
    	let t1;
    	let client;
    	let t2;
    	let aboutus;
    	let t3;
    	let services;
    	let t4;
    	let team;
    	let t5;
    	let pricing;
    	let t6;
    	let testimonial;
    	let t7;
    	let blog;
    	let t8;
    	let contact;
    	let t9;
    	let footer;
    	let t10;
    	let switcher;
    	let current;
    	navbar = new Navbar({ props: { extraclass: "navbar-white" } });
    	homesection = new HomeSection$8({});
    	client = new Client({});
    	aboutus = new AboutUs({});

    	services = new Services({
    			props: {
    				serviceData: MOCK_DATA.SERVICE_DATA,
    				websiteData: MOCK_DATA.WEBSITE_DESCRIPTION
    			}
    		});

    	team = new Team({ props: { teamData: MOCK_DATA.TEAM_DATA } });

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA }
    		});

    	testimonial = new Testimonial({
    			props: {
    				testimonialData: MOCK_DATA.TESATIMONIAL_DATA,
    				startedData: MOCK_DATA.GET_STARTED
    			}
    		});

    	blog = new Blog({ props: { blogData: MOCK_DATA.BLOG_DATA } });
    	contact = new Contact({});
    	footer = new Footer({});
    	switcher = new Switcher({});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(homesection.$$.fragment);
    			t1 = space();
    			create_component(client.$$.fragment);
    			t2 = space();
    			create_component(aboutus.$$.fragment);
    			t3 = space();
    			create_component(services.$$.fragment);
    			t4 = space();
    			create_component(team.$$.fragment);
    			t5 = space();
    			create_component(pricing.$$.fragment);
    			t6 = space();
    			create_component(testimonial.$$.fragment);
    			t7 = space();
    			create_component(blog.$$.fragment);
    			t8 = space();
    			create_component(contact.$$.fragment);
    			t9 = space();
    			create_component(footer.$$.fragment);
    			t10 = space();
    			create_component(switcher.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(homesection, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(client, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(aboutus, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(services, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(team, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(pricing, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(testimonial, target, anchor);
    			insert(target, t7, anchor);
    			mount_component(blog, target, anchor);
    			insert(target, t8, anchor);
    			mount_component(contact, target, anchor);
    			insert(target, t9, anchor);
    			mount_component(footer, target, anchor);
    			insert(target, t10, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(homesection.$$.fragment, local);
    			transition_in(client.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(homesection.$$.fragment, local);
    			transition_out(client.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			destroy_component(homesection, detaching);
    			if (detaching) detach(t1);
    			destroy_component(client, detaching);
    			if (detaching) detach(t2);
    			destroy_component(aboutus, detaching);
    			if (detaching) detach(t3);
    			destroy_component(services, detaching);
    			if (detaching) detach(t4);
    			destroy_component(team, detaching);
    			if (detaching) detach(t5);
    			destroy_component(pricing, detaching);
    			if (detaching) detach(t6);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach(t7);
    			destroy_component(blog, detaching);
    			if (detaching) detach(t8);
    			destroy_component(contact, detaching);
    			if (detaching) detach(t9);
    			destroy_component(footer, detaching);
    			if (detaching) detach(t10);
    			destroy_component(switcher, detaching);
    		}
    	};
    }

    function instance$8($$self) {
    	onMount(() => {
    		var body = document.body;
    		body.classList.remove("bg-account-pages");
    	});

    	return [];
    }

    class Layout_1 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$8, create_fragment$k, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout2/HomeSection.svelte generated by Svelte v3.50.1 */

    function create_default_slot_2$b(ctx) {
    	let h4;
    	let t1;
    	let h1;
    	let t3;
    	let p;
    	let t5;
    	let a0;
    	let t7;
    	let a1;

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "RYONAN";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "Website optimization service";
    			t3 = space();
    			p = element("p");
    			p.textContent = "We boost your site pagespeed scores and help you increase your conversion rates and SEO rankings";
    			t5 = space();
    			a0 = element("a");
    			a0.innerHTML = `SHOPIFY <i class="mdi mdi-rotate-90 mdi-rocket"></i>`;
    			t7 = space();
    			a1 = element("a");
    			a1.innerHTML = `WORDPRESS <i class="mdi mdi-rotate-90 mdi-rocket"></i>`;
    			attr(h4, "class", "home-small-title");
    			attr(h1, "class", "home-title");
    			attr(p, "class", "pt-3 home-desc mx-auto");
    			attr(a0, "href", "#");
    			attr(a0, "class", "btn btn-primary mt-5 waves-effect waves-light");
    			attr(a1, "href", "#");
    			attr(a1, "class", "btn btn-primary mt-5 waves-effect waves-light");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, p, anchor);
    			insert(target, t5, anchor);
    			insert(target, a0, anchor);
    			insert(target, t7, anchor);
    			insert(target, a1, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(p);
    			if (detaching) detach(t5);
    			if (detaching) detach(a0);
    			if (detaching) detach(t7);
    			if (detaching) detach(a1);
    		}
    	};
    }

    // (21:2) <Row class="justify-content-center">
    function create_default_slot_1$b(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 8,
    				class: "text-white text-center",
    				$$slots: { default: [create_default_slot_2$b] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (20:1) <Container>
    function create_default_slot$b(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$b] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$j(ctx) {
    	let section;
    	let div0;
    	let t0;
    	let container;
    	let t1;
    	let div7;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			div0 = element("div");
    			t0 = space();
    			create_component(container.$$.fragment);
    			t1 = space();
    			div7 = element("div");

    			div7.innerHTML = `<div class="waves-shape shape-one"><div class="wave wave-one" style="background-image: url(&#39;images/wave-shape/wave1.png&#39;})"></div></div> 
		<div class="waves-shape shape-two"><div class="wave wave-two" style="background-image: url(&#39;images/wave-shape/wave2.png&#39;})"></div></div> 
		<div class="waves-shape shape-three"><div class="wave wave-three" style="background-image: url(&#39;images/wave-shape/wave3.png&#39;})"></div></div>`;

    			attr(div0, "class", "bg-overlay");
    			attr(div7, "class", "wave-effect wave-anim");
    			attr(section, "class", "section bg-home home-half common-section");
    			attr(section, "id", "home");
    			attr(section, "data-image-src", "images/bg-home.jpg");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div0);
    			append(section, t0);
    			mount_component(container, section, null);
    			append(section, t1);
    			append(section, div7);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$7($$self) {

    	return [];
    }

    class HomeSection$7 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$7, create_fragment$j, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout2/Layout_2.svelte generated by Svelte v3.50.1 */

    function create_fragment$i(ctx) {
    	let navbar;
    	let t0;
    	let homesection;
    	let t1;
    	let aboutus;
    	let t2;
    	let services;
    	let t3;
    	let pricing;
    	let t4;
    	let contact;
    	let current;
    	navbar = new Navbar({ props: { extraclass: "" } });
    	homesection = new HomeSection$7({});
    	aboutus = new AboutUs({});

    	services = new Services({
    			props: {
    				serviceData: MOCK_DATA.SERVICE_DATA,
    				websiteData: MOCK_DATA.WEBSITE_DESCRIPTION
    			}
    		});

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA }
    		});

    	contact = new Contact({});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(homesection.$$.fragment);
    			t1 = space();
    			create_component(aboutus.$$.fragment);
    			t2 = space();
    			create_component(services.$$.fragment);
    			t3 = space();
    			create_component(pricing.$$.fragment);
    			t4 = space();
    			create_component(contact.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(homesection, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(aboutus, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(services, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(pricing, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(homesection.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(homesection.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			destroy_component(homesection, detaching);
    			if (detaching) detach(t1);
    			destroy_component(aboutus, detaching);
    			if (detaching) detach(t2);
    			destroy_component(services, detaching);
    			if (detaching) detach(t3);
    			destroy_component(pricing, detaching);
    			if (detaching) detach(t4);
    			destroy_component(contact, detaching);
    		}
    	};
    }

    class Layout_2 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$i, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout3/HomeSection.svelte generated by Svelte v3.50.1 */

    function create_default_slot_4$7(ctx) {
    	let video;
    	let video_src_value;

    	return {
    		c() {
    			video = element("video");
    			video.innerHTML = `<track default="" kind="captions" type="video/mp4"/>`;
    			attr(video, "id", "VisaChipCardVideo");
    			attr(video, "class", "video-box");
    			if (!src_url_equal(video.src, video_src_value = "https://www.w3schools.com/html/mov_bbb.mp4")) attr(video, "src", video_src_value);
    			video.controls = true;
    		},
    		m(target, anchor) {
    			insert(target, video, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(video);
    		}
    	};
    }

    // (33:6) <Modal isOpen={open} size="lg" {toggle} class="home-modal">
    function create_default_slot_3$8(ctx) {
    	let modalheader;
    	let t;
    	let modalbody;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle: /*toggle*/ ctx[1],
    				class: "border-0"
    			}
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_4$7] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(modalheader.$$.fragment);
    			t = space();
    			create_component(modalbody.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert(target, t, anchor);
    			mount_component(modalbody, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach(t);
    			destroy_component(modalbody, detaching);
    		}
    	};
    }

    // (21:5) <Col lg={8} class="text-white text-center">
    function create_default_slot_2$a(ctx) {
    	let h4;
    	let t1;
    	let h1;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t6;
    	let modal;
    	let current;
    	let mounted;
    	let dispose;

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[0],
    				size: "lg",
    				toggle: /*toggle*/ ctx[1],
    				class: "home-modal",
    				$$slots: { default: [create_default_slot_3$8] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Awesome Design";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "We love make things amazing and simple";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Maecenas class semper class semper sollicitudin lectus lorem iaculis imperdiet aliquam\n\t\t\t\t\t\t\tvehicula tempor auctor curabitur pede aenean ornare.";
    			t5 = space();
    			p1 = element("p");
    			p1.innerHTML = `<a href="${"#"}" class="play-btn video-play-icon"><i class="mdi mdi-play text-center"></i></a>`;
    			t6 = space();
    			create_component(modal.$$.fragment);
    			attr(h4, "class", "home-small-title");
    			attr(h1, "class", "home-title");
    			attr(p0, "class", "pt-3 home-desc mx-auto");
    			attr(p1, "class", "play-shadow mt-4");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, p0, anchor);
    			insert(target, t5, anchor);
    			insert(target, p1, anchor);
    			insert(target, t6, anchor);
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen(p1, "click", /*toggle*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.isOpen = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(p0);
    			if (detaching) detach(t5);
    			if (detaching) detach(p1);
    			if (detaching) detach(t6);
    			destroy_component(modal, detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (20:4) <Row class="justify-content-center">
    function create_default_slot_1$a(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 8,
    				class: "text-white text-center",
    				$$slots: { default: [create_default_slot_2$a] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope, open*/ 5) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (19:3) <Container>
    function create_default_slot$a(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$a] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, open*/ 5) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$h(ctx) {
    	let section;
    	let div0;
    	let t;
    	let div2;
    	let div1;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			div0 = element("div");
    			t = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(container.$$.fragment);
    			attr(div0, "class", "bg-overlay");
    			attr(div1, "class", "display-table-cell");
    			attr(div2, "class", "display-table");
    			attr(section, "class", "section bg-home vh-100 common-section");
    			attr(section, "id", "home");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div0);
    			append(section, t);
    			append(section, div2);
    			append(div2, div1);
    			mount_component(container, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope, open*/ 5) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let open = false;

    	/**
     * Toggle modal
     */
    	const toggle = () => {
    		$$invalidate(0, open = !open);
    	};

    	return [open, toggle];
    }

    class HomeSection$6 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$6, create_fragment$h, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout3/Layout_3.svelte generated by Svelte v3.50.1 */

    function create_fragment$g(ctx) {
    	let navbar;
    	let t0;
    	let homesection;
    	let t1;
    	let client;
    	let t2;
    	let aboutus;
    	let t3;
    	let services;
    	let t4;
    	let team;
    	let t5;
    	let pricing;
    	let t6;
    	let testimonial;
    	let t7;
    	let blog;
    	let t8;
    	let contact;
    	let t9;
    	let footer;
    	let t10;
    	let switcher;
    	let current;
    	navbar = new Navbar({ props: { extraclass: "" } });
    	homesection = new HomeSection$6({});
    	client = new Client({});
    	aboutus = new AboutUs({});

    	services = new Services({
    			props: {
    				serviceData: MOCK_DATA.SERVICE_DATA,
    				websiteData: MOCK_DATA.WEBSITE_DESCRIPTION
    			}
    		});

    	team = new Team({ props: { teamData: MOCK_DATA.TEAM_DATA } });

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA }
    		});

    	testimonial = new Testimonial({
    			props: {
    				testimonialData: MOCK_DATA.TESATIMONIAL_DATA,
    				startedData: MOCK_DATA.GET_STARTED
    			}
    		});

    	blog = new Blog({ props: { blogData: MOCK_DATA.BLOG_DATA } });
    	contact = new Contact({});
    	footer = new Footer({});
    	switcher = new Switcher({});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(homesection.$$.fragment);
    			t1 = space();
    			create_component(client.$$.fragment);
    			t2 = space();
    			create_component(aboutus.$$.fragment);
    			t3 = space();
    			create_component(services.$$.fragment);
    			t4 = space();
    			create_component(team.$$.fragment);
    			t5 = space();
    			create_component(pricing.$$.fragment);
    			t6 = space();
    			create_component(testimonial.$$.fragment);
    			t7 = space();
    			create_component(blog.$$.fragment);
    			t8 = space();
    			create_component(contact.$$.fragment);
    			t9 = space();
    			create_component(footer.$$.fragment);
    			t10 = space();
    			create_component(switcher.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(homesection, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(client, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(aboutus, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(services, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(team, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(pricing, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(testimonial, target, anchor);
    			insert(target, t7, anchor);
    			mount_component(blog, target, anchor);
    			insert(target, t8, anchor);
    			mount_component(contact, target, anchor);
    			insert(target, t9, anchor);
    			mount_component(footer, target, anchor);
    			insert(target, t10, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(homesection.$$.fragment, local);
    			transition_in(client.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(homesection.$$.fragment, local);
    			transition_out(client.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			destroy_component(homesection, detaching);
    			if (detaching) detach(t1);
    			destroy_component(client, detaching);
    			if (detaching) detach(t2);
    			destroy_component(aboutus, detaching);
    			if (detaching) detach(t3);
    			destroy_component(services, detaching);
    			if (detaching) detach(t4);
    			destroy_component(team, detaching);
    			if (detaching) detach(t5);
    			destroy_component(pricing, detaching);
    			if (detaching) detach(t6);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach(t7);
    			destroy_component(blog, detaching);
    			if (detaching) detach(t8);
    			destroy_component(contact, detaching);
    			if (detaching) detach(t9);
    			destroy_component(footer, detaching);
    			if (detaching) detach(t10);
    			destroy_component(switcher, detaching);
    		}
    	};
    }

    class Layout_3 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$g, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout4/HomeSection.svelte generated by Svelte v3.50.1 */

    function create_default_slot_4$6(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");

    			div.innerHTML = `<h4 class="home-small-title">Awesome Design</h4> 
							<h1 class="home-title">We love make things amazing and simple</h1> 
							<p class="pt-3 home-desc home-subtitle-width-100">Maecenas class semper class semper sollicitudin lectus lorem iaculis imperdiet aliquam
								vehicula tempor auctor curabitur pede aenean ornare.</p> 
							<a href="${"#"}" class="btn btn-primary mt-5 waves-effect waves-light">Get Started <i class="mdi mdi-arrow-right"></i></a>`;

    			attr(div, "class", "mt-4");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (29:7) <Form class="registration-form" id="registration-form">
    function create_default_slot_3$7(ctx) {
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let button;
    	let current;

    	input0 = new Input({
    			props: {
    				type: "text",
    				id: "exampleInputName1",
    				class: "form-control registration-input-box",
    				placeholder: "Name"
    			}
    		});

    	input1 = new Input({
    			props: {
    				type: "email",
    				id: "exampleInputEmail1",
    				class: "form-control registration-input-box",
    				placeholder: "Email"
    			}
    		});

    	input2 = new Input({
    			props: {
    				type: "textarea",
    				class: "form-control registration-textarea-box",
    				rows: "4",
    				placeholder: "Message"
    			}
    		});

    	return {
    		c() {
    			create_component(input0.$$.fragment);
    			t0 = space();
    			create_component(input1.$$.fragment);
    			t1 = space();
    			create_component(input2.$$.fragment);
    			t2 = space();
    			button = element("button");
    			button.textContent = "Send Detail";
    			attr(button, "class", "btn btn-primary w-100 waves-effect waves-light");
    		},
    		m(target, anchor) {
    			mount_component(input0, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(input1, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(input2, target, anchor);
    			insert(target, t2, anchor);
    			insert(target, button, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(input0.$$.fragment, local);
    			transition_in(input1.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input0.$$.fragment, local);
    			transition_out(input1.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input0, detaching);
    			if (detaching) detach(t0);
    			destroy_component(input1, detaching);
    			if (detaching) detach(t1);
    			destroy_component(input2, detaching);
    			if (detaching) detach(t2);
    			if (detaching) detach(button);
    		}
    	};
    }

    // (26:5) <Col lg={{ size: 4, offset: 1 }}>
    function create_default_slot_2$9(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				class: "registration-form",
    				id: "registration-form",
    				$$slots: { default: [create_default_slot_3$7] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Get 30 day FREE Trial";
    			t1 = space();
    			create_component(form.$$.fragment);
    			attr(h4, "class", "form-heading text-center mt-2");
    			attr(div, "class", "home-registration-form bg-white mt-4");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, h4);
    			append(div, t1);
    			mount_component(form, div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const form_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(form);
    		}
    	};
    }

    // (12:4) <Row class="vertical-content">
    function create_default_slot_1$9(ctx) {
    	let col0;
    	let t;
    	let col1;
    	let current;

    	col0 = new Col({
    			props: {
    				lg: 7,
    				class: "text-white text-start",
    				$$slots: { default: [create_default_slot_4$6] },
    				$$scope: { ctx }
    			}
    		});

    	col1 = new Col({
    			props: {
    				lg: { size: 4, offset: 1 },
    				$$slots: { default: [create_default_slot_2$9] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col0.$$.fragment);
    			t = space();
    			create_component(col1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col0, target, anchor);
    			insert(target, t, anchor);
    			mount_component(col1, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col0_changes.$$scope = { dirty, ctx };
    			}

    			col0.$set(col0_changes);
    			const col1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col1_changes.$$scope = { dirty, ctx };
    			}

    			col1.$set(col1_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col0.$$.fragment, local);
    			transition_in(col1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col0.$$.fragment, local);
    			transition_out(col1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col0, detaching);
    			if (detaching) detach(t);
    			destroy_component(col1, detaching);
    		}
    	};
    }

    // (11:3) <Container>
    function create_default_slot$9(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "vertical-content",
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$f(ctx) {
    	let section;
    	let div0;
    	let t;
    	let div2;
    	let div1;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			div0 = element("div");
    			t = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(container.$$.fragment);
    			attr(div0, "class", "bg-overlay");
    			attr(div1, "class", "display-table-cell");
    			attr(div2, "class", "display-table");
    			attr(section, "class", "section bg-home home-half home-registration common-section");
    			attr(section, "id", "home");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div0);
    			append(section, t);
    			append(section, div2);
    			append(div2, div1);
    			mount_component(container, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    class HomeSection$5 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$f, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout4/Layout_4.svelte generated by Svelte v3.50.1 */

    function create_fragment$e(ctx) {
    	let navbar;
    	let t0;
    	let homesection;
    	let t1;
    	let client;
    	let t2;
    	let aboutus;
    	let t3;
    	let services;
    	let t4;
    	let team;
    	let t5;
    	let pricing;
    	let t6;
    	let testimonial;
    	let t7;
    	let blog;
    	let t8;
    	let contact;
    	let t9;
    	let footer;
    	let t10;
    	let switcher;
    	let current;
    	navbar = new Navbar({ props: { extraclass: "navbar-white" } });
    	homesection = new HomeSection$5({});
    	client = new Client({});
    	aboutus = new AboutUs({});

    	services = new Services({
    			props: {
    				serviceData: MOCK_DATA.SERVICE_DATA,
    				websiteData: MOCK_DATA.WEBSITE_DESCRIPTION
    			}
    		});

    	team = new Team({ props: { teamData: MOCK_DATA.TEAM_DATA } });

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA }
    		});

    	testimonial = new Testimonial({
    			props: {
    				testimonialData: MOCK_DATA.TESATIMONIAL_DATA,
    				startedData: MOCK_DATA.GET_STARTED
    			}
    		});

    	blog = new Blog({ props: { blogData: MOCK_DATA.BLOG_DATA } });
    	contact = new Contact({});
    	footer = new Footer({});
    	switcher = new Switcher({});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(homesection.$$.fragment);
    			t1 = space();
    			create_component(client.$$.fragment);
    			t2 = space();
    			create_component(aboutus.$$.fragment);
    			t3 = space();
    			create_component(services.$$.fragment);
    			t4 = space();
    			create_component(team.$$.fragment);
    			t5 = space();
    			create_component(pricing.$$.fragment);
    			t6 = space();
    			create_component(testimonial.$$.fragment);
    			t7 = space();
    			create_component(blog.$$.fragment);
    			t8 = space();
    			create_component(contact.$$.fragment);
    			t9 = space();
    			create_component(footer.$$.fragment);
    			t10 = space();
    			create_component(switcher.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(homesection, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(client, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(aboutus, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(services, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(team, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(pricing, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(testimonial, target, anchor);
    			insert(target, t7, anchor);
    			mount_component(blog, target, anchor);
    			insert(target, t8, anchor);
    			mount_component(contact, target, anchor);
    			insert(target, t9, anchor);
    			mount_component(footer, target, anchor);
    			insert(target, t10, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(homesection.$$.fragment, local);
    			transition_in(client.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(homesection.$$.fragment, local);
    			transition_out(client.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			destroy_component(homesection, detaching);
    			if (detaching) detach(t1);
    			destroy_component(client, detaching);
    			if (detaching) detach(t2);
    			destroy_component(aboutus, detaching);
    			if (detaching) detach(t3);
    			destroy_component(services, detaching);
    			if (detaching) detach(t4);
    			destroy_component(team, detaching);
    			if (detaching) detach(t5);
    			destroy_component(pricing, detaching);
    			if (detaching) detach(t6);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach(t7);
    			destroy_component(blog, detaching);
    			if (detaching) detach(t8);
    			destroy_component(contact, detaching);
    			if (detaching) detach(t9);
    			destroy_component(footer, detaching);
    			if (detaching) detach(t10);
    			destroy_component(switcher, detaching);
    		}
    	};
    }

    class Layout_4 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$e, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout5/HomeSection.svelte generated by Svelte v3.50.1 */

    function create_default_slot_2$8(ctx) {
    	let h4;
    	let t1;
    	let h1;
    	let t3;
    	let p;
    	let t5;
    	let a;
    	let t7;
    	let img;
    	let img_src_value;

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Awesome Design";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "We love make things amazing and simple";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Maecenas class semper class semper sollicitudin lectus lorem iaculis imperdiet aliquam\n\t\t\t\t\t\t\tvehicula tempor auctor curabitur pede aenean ornare.";
    			t5 = space();
    			a = element("a");
    			a.textContent = "Get Started";
    			t7 = space();
    			img = element("img");
    			attr(h4, "class", "home-small-title");
    			attr(h1, "class", "home-title");
    			attr(p, "class", "pt-3 home-desc mx-auto");
    			attr(a, "href", "#");
    			attr(a, "class", "btn btn-primary mt-4");
    			if (!src_url_equal(img.src, img_src_value = "images/home-dashboard.png")) attr(img, "src", img_src_value);
    			attr(img, "alt", "");
    			attr(img, "class", "img-fluid center-block mt-4");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, p, anchor);
    			insert(target, t5, anchor);
    			insert(target, a, anchor);
    			insert(target, t7, anchor);
    			insert(target, img, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(p);
    			if (detaching) detach(t5);
    			if (detaching) detach(a);
    			if (detaching) detach(t7);
    			if (detaching) detach(img);
    		}
    	};
    }

    // (13:4) <Row class="justify-content-center">
    function create_default_slot_1$8(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 8,
    				class: "text-white text-center",
    				$$slots: { default: [create_default_slot_2$8] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (12:3) <Container>
    function create_default_slot$8(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$d(ctx) {
    	let section;
    	let div0;
    	let t;
    	let div2;
    	let div1;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			div0 = element("div");
    			t = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(container.$$.fragment);
    			attr(div0, "class", "bg-overlay");
    			attr(div1, "class", "home-cell-bottom");
    			attr(div2, "class", "display-table");
    			attr(section, "class", "home-padding-t-150 position-relative common-section");
    			attr(section, "id", "home");
    			set_style(section, "background-image", "url('images/img-2.jpg')");
    			set_style(section, "background-size", "cover");
    			set_style(section, "background-position", "center");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div0);
    			append(section, t);
    			append(section, div2);
    			append(div2, div1);
    			mount_component(container, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    class HomeSection$4 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$d, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout5/Layout_5.svelte generated by Svelte v3.50.1 */

    function create_fragment$c(ctx) {
    	let navbar;
    	let t0;
    	let homesection;
    	let t1;
    	let client;
    	let t2;
    	let aboutus;
    	let t3;
    	let services;
    	let t4;
    	let team;
    	let t5;
    	let pricing;
    	let t6;
    	let testimonial;
    	let t7;
    	let blog;
    	let t8;
    	let contact;
    	let t9;
    	let footer;
    	let t10;
    	let switcher;
    	let current;
    	navbar = new Navbar({ props: { extraclass: "" } });
    	homesection = new HomeSection$4({});
    	client = new Client({});
    	aboutus = new AboutUs({});

    	services = new Services({
    			props: {
    				serviceData: MOCK_DATA.SERVICE_DATA,
    				websiteData: MOCK_DATA.WEBSITE_DESCRIPTION
    			}
    		});

    	team = new Team({ props: { teamData: MOCK_DATA.TEAM_DATA } });

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA }
    		});

    	testimonial = new Testimonial({
    			props: {
    				testimonialData: MOCK_DATA.TESATIMONIAL_DATA,
    				startedData: MOCK_DATA.GET_STARTED
    			}
    		});

    	blog = new Blog({ props: { blogData: MOCK_DATA.BLOG_DATA } });
    	contact = new Contact({});
    	footer = new Footer({});
    	switcher = new Switcher({});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(homesection.$$.fragment);
    			t1 = space();
    			create_component(client.$$.fragment);
    			t2 = space();
    			create_component(aboutus.$$.fragment);
    			t3 = space();
    			create_component(services.$$.fragment);
    			t4 = space();
    			create_component(team.$$.fragment);
    			t5 = space();
    			create_component(pricing.$$.fragment);
    			t6 = space();
    			create_component(testimonial.$$.fragment);
    			t7 = space();
    			create_component(blog.$$.fragment);
    			t8 = space();
    			create_component(contact.$$.fragment);
    			t9 = space();
    			create_component(footer.$$.fragment);
    			t10 = space();
    			create_component(switcher.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(homesection, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(client, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(aboutus, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(services, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(team, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(pricing, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(testimonial, target, anchor);
    			insert(target, t7, anchor);
    			mount_component(blog, target, anchor);
    			insert(target, t8, anchor);
    			mount_component(contact, target, anchor);
    			insert(target, t9, anchor);
    			mount_component(footer, target, anchor);
    			insert(target, t10, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(homesection.$$.fragment, local);
    			transition_in(client.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(homesection.$$.fragment, local);
    			transition_out(client.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			destroy_component(homesection, detaching);
    			if (detaching) detach(t1);
    			destroy_component(client, detaching);
    			if (detaching) detach(t2);
    			destroy_component(aboutus, detaching);
    			if (detaching) detach(t3);
    			destroy_component(services, detaching);
    			if (detaching) detach(t4);
    			destroy_component(team, detaching);
    			if (detaching) detach(t5);
    			destroy_component(pricing, detaching);
    			if (detaching) detach(t6);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach(t7);
    			destroy_component(blog, detaching);
    			if (detaching) detach(t8);
    			destroy_component(contact, detaching);
    			if (detaching) detach(t9);
    			destroy_component(footer, detaching);
    			if (detaching) detach(t10);
    			destroy_component(switcher, detaching);
    		}
    	};
    }

    class Layout_5 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$c, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout6/HomeSection.svelte generated by Svelte v3.50.1 */

    function create_default_slot_3$6(ctx) {
    	let input;
    	let t0;
    	let button;

    	return {
    		c() {
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Subscribe";
    			attr(input, "type", "text");
    			attr(input, "placeholder", "Email");
    			attr(button, "type", "submit");
    			attr(button, "class", "btn btn-primary");
    		},
    		m(target, anchor) {
    			insert(target, input, anchor);
    			insert(target, t0, anchor);
    			insert(target, button, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(input);
    			if (detaching) detach(t0);
    			if (detaching) detach(button);
    		}
    	};
    }

    // (13:5) <Col lg={8} class="text-white text-center">
    function create_default_slot_2$7(ctx) {
    	let h4;
    	let t1;
    	let h1;
    	let t3;
    	let p;
    	let t5;
    	let div;
    	let form;
    	let current;

    	form = new Form({
    			props: {
    				action: "#",
    				$$slots: { default: [create_default_slot_3$6] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Awesome Design";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "We love make things amazing and simple";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Maecenas class semper class semper sollicitudin lectus\n\t\t\t\t\t\t\tlorem iaculis imperdiet aliquam vehicula tempor auctor curabitur pede aenean ornare.";
    			t5 = space();
    			div = element("div");
    			create_component(form.$$.fragment);
    			attr(h4, "class", "home-small-title");
    			attr(h1, "class", "home-title");
    			attr(p, "class", "pt-3 home-desc mx-auto");
    			attr(div, "class", "text-center subscribe-form mt-5");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, p, anchor);
    			insert(target, t5, anchor);
    			insert(target, div, anchor);
    			mount_component(form, div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const form_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(p);
    			if (detaching) detach(t5);
    			if (detaching) detach(div);
    			destroy_component(form);
    		}
    	};
    }

    // (12:4) <Row class="justify-content-center">
    function create_default_slot_1$7(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 8,
    				class: "text-white text-center",
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (11:3) <Container>
    function create_default_slot$7(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$b(ctx) {
    	let section;
    	let div0;
    	let t;
    	let div2;
    	let div1;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			div0 = element("div");
    			t = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(container.$$.fragment);
    			attr(div0, "class", "bg-overlay");
    			attr(div1, "class", "home-cell-bottom");
    			attr(div2, "class", "display-table");
    			attr(section, "class", "section bg-home home-half common-section");
    			attr(section, "id", "home");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div0);
    			append(section, t);
    			append(section, div2);
    			append(div2, div1);
    			mount_component(container, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    class HomeSection$3 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$b, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout6/Layout_6.svelte generated by Svelte v3.50.1 */

    function create_fragment$a(ctx) {
    	let navbar;
    	let t0;
    	let homesection;
    	let t1;
    	let client;
    	let t2;
    	let aboutus;
    	let t3;
    	let services;
    	let t4;
    	let team;
    	let t5;
    	let pricing;
    	let t6;
    	let testimonial;
    	let t7;
    	let blog;
    	let t8;
    	let contact;
    	let t9;
    	let footer;
    	let t10;
    	let switcher;
    	let current;
    	navbar = new Navbar({ props: { extraclass: "" } });
    	homesection = new HomeSection$3({});
    	client = new Client({});
    	aboutus = new AboutUs({});

    	services = new Services({
    			props: {
    				serviceData: MOCK_DATA.SERVICE_DATA,
    				websiteData: MOCK_DATA.WEBSITE_DESCRIPTION
    			}
    		});

    	team = new Team({ props: { teamData: MOCK_DATA.TEAM_DATA } });

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA }
    		});

    	testimonial = new Testimonial({
    			props: {
    				testimonialData: MOCK_DATA.TESATIMONIAL_DATA,
    				startedData: MOCK_DATA.GET_STARTED
    			}
    		});

    	blog = new Blog({ props: { blogData: MOCK_DATA.BLOG_DATA } });
    	contact = new Contact({});
    	footer = new Footer({});
    	switcher = new Switcher({});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(homesection.$$.fragment);
    			t1 = space();
    			create_component(client.$$.fragment);
    			t2 = space();
    			create_component(aboutus.$$.fragment);
    			t3 = space();
    			create_component(services.$$.fragment);
    			t4 = space();
    			create_component(team.$$.fragment);
    			t5 = space();
    			create_component(pricing.$$.fragment);
    			t6 = space();
    			create_component(testimonial.$$.fragment);
    			t7 = space();
    			create_component(blog.$$.fragment);
    			t8 = space();
    			create_component(contact.$$.fragment);
    			t9 = space();
    			create_component(footer.$$.fragment);
    			t10 = space();
    			create_component(switcher.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(homesection, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(client, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(aboutus, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(services, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(team, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(pricing, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(testimonial, target, anchor);
    			insert(target, t7, anchor);
    			mount_component(blog, target, anchor);
    			insert(target, t8, anchor);
    			mount_component(contact, target, anchor);
    			insert(target, t9, anchor);
    			mount_component(footer, target, anchor);
    			insert(target, t10, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(homesection.$$.fragment, local);
    			transition_in(client.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(homesection.$$.fragment, local);
    			transition_out(client.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			destroy_component(homesection, detaching);
    			if (detaching) detach(t1);
    			destroy_component(client, detaching);
    			if (detaching) detach(t2);
    			destroy_component(aboutus, detaching);
    			if (detaching) detach(t3);
    			destroy_component(services, detaching);
    			if (detaching) detach(t4);
    			destroy_component(team, detaching);
    			if (detaching) detach(t5);
    			destroy_component(pricing, detaching);
    			if (detaching) detach(t6);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach(t7);
    			destroy_component(blog, detaching);
    			if (detaching) detach(t8);
    			destroy_component(contact, detaching);
    			if (detaching) detach(t9);
    			destroy_component(footer, detaching);
    			if (detaching) detach(t10);
    			destroy_component(switcher, detaching);
    		}
    	};
    }

    class Layout_6 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$a, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout7/HomeSection.svelte generated by Svelte v3.50.1 */

    function create_default_slot_4$5(ctx) {
    	let video;
    	let video_src_value;

    	return {
    		c() {
    			video = element("video");
    			video.innerHTML = `<track default="" kind="captions" type="video/mp4"/>`;
    			attr(video, "id", "VisaChipCardVideo");
    			attr(video, "class", "video-box");
    			if (!src_url_equal(video.src, video_src_value = "https://www.w3schools.com/html/mov_bbb.mp4")) attr(video, "src", video_src_value);
    			video.controls = true;
    		},
    		m(target, anchor) {
    			insert(target, video, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(video);
    		}
    	};
    }

    // (59:6) <Modal isOpen={open} size="lg" {toggle} class="home-modal">
    function create_default_slot_3$5(ctx) {
    	let modalheader;
    	let t;
    	let modalbody;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle: /*toggle*/ ctx[1],
    				class: "border-0"
    			}
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_4$5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(modalheader.$$.fragment);
    			t = space();
    			create_component(modalbody.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert(target, t, anchor);
    			mount_component(modalbody, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach(t);
    			destroy_component(modalbody, detaching);
    		}
    	};
    }

    // (47:5) <Col lg={8} class="text-white text-center">
    function create_default_slot_2$6(ctx) {
    	let h4;
    	let t1;
    	let h1;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let t6;
    	let modal;
    	let current;
    	let mounted;
    	let dispose;

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[0],
    				size: "lg",
    				toggle: /*toggle*/ ctx[1],
    				class: "home-modal",
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Awesome Design";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = " ";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Maecenas class semper class semper sollicitudin lectus lorem iaculis imperdiet aliquam\n\t\t\t\t\t\t\tvehicula tempor auctor curabitur pede aenean ornare.";
    			t5 = space();
    			p1 = element("p");
    			p1.innerHTML = `<a href="${'#'}" class="play-btn video-play-icon"><i class="mdi mdi-play text-center"></i></a>`;
    			t6 = space();
    			create_component(modal.$$.fragment);
    			attr(h4, "class", "home-small-title");
    			attr(h1, "class", "home-title text-rotate");
    			attr(h1, "id", "target");
    			attr(p0, "class", "pt-3 home-desc mx-auto");
    			attr(p1, "class", "play-shadow mt-4");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, p0, anchor);
    			insert(target, t5, anchor);
    			insert(target, p1, anchor);
    			insert(target, t6, anchor);
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen(p1, "click", /*toggle*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.isOpen = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 8) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(p0);
    			if (detaching) detach(t5);
    			if (detaching) detach(p1);
    			if (detaching) detach(t6);
    			destroy_component(modal, detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (46:4) <Row class="justify-content-center">
    function create_default_slot_1$6(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 8,
    				class: "text-white text-center",
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope, open*/ 9) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (45:3) <Container>
    function create_default_slot$6(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, open*/ 9) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$9(ctx) {
    	let section;
    	let div0;
    	let t;
    	let div2;
    	let div1;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			div0 = element("div");
    			t = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(container.$$.fragment);
    			attr(div0, "class", "bg-overlay");
    			attr(div1, "class", "display-table-cell");
    			attr(div2, "class", "display-table");
    			attr(section, "class", "section section-lg vh-100 common-section");
    			attr(section, "id", "home");
    			set_style(section, "background-image", "url('images/img-1.jpg')");
    			set_style(section, "background-size", "cover");
    			set_style(section, "background-position", "center");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div0);
    			append(section, t);
    			append(section, div2);
    			append(div2, div1);
    			mount_component(container, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope, open*/ 9) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let open = false;

    	/**
     * Toggle modal
     */
    	const toggle = () => {
    		$$invalidate(0, open = !open);
    	};

    	const text_rotate = new Array('Professional Landing Page Template', 'We help startups launch their products', 'Perfect solution for small businesses');

    	onMount(() => {
    		let i = 0;

    		function changeText() {
    			document.getElementById('target').innerHTML = text_rotate[i];
    			i = i < text_rotate.length - 1 ? i + 1 : 0;
    			console.log(i);

    			setTimeout(
    				() => {
    					changeText();
    				},
    				3000
    			);
    		}

    		changeText();
    	});

    	return [open, toggle];
    }

    class HomeSection$2 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$5, create_fragment$9, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout7/Layout_7.svelte generated by Svelte v3.50.1 */

    function create_fragment$8(ctx) {
    	let navbar;
    	let t0;
    	let homesection;
    	let t1;
    	let client;
    	let t2;
    	let aboutus;
    	let t3;
    	let services;
    	let t4;
    	let team;
    	let t5;
    	let pricing;
    	let t6;
    	let testimonial;
    	let t7;
    	let blog;
    	let t8;
    	let contact;
    	let t9;
    	let footer;
    	let t10;
    	let switcher;
    	let current;
    	navbar = new Navbar({ props: { extraclass: "" } });
    	homesection = new HomeSection$2({});
    	client = new Client({});
    	aboutus = new AboutUs({});

    	services = new Services({
    			props: {
    				serviceData: MOCK_DATA.SERVICE_DATA,
    				websiteData: MOCK_DATA.WEBSITE_DESCRIPTION
    			}
    		});

    	team = new Team({ props: { teamData: MOCK_DATA.TEAM_DATA } });

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA }
    		});

    	testimonial = new Testimonial({
    			props: {
    				testimonialData: MOCK_DATA.TESATIMONIAL_DATA,
    				startedData: MOCK_DATA.GET_STARTED
    			}
    		});

    	blog = new Blog({ props: { blogData: MOCK_DATA.BLOG_DATA } });
    	contact = new Contact({});
    	footer = new Footer({});
    	switcher = new Switcher({});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(homesection.$$.fragment);
    			t1 = space();
    			create_component(client.$$.fragment);
    			t2 = space();
    			create_component(aboutus.$$.fragment);
    			t3 = space();
    			create_component(services.$$.fragment);
    			t4 = space();
    			create_component(team.$$.fragment);
    			t5 = space();
    			create_component(pricing.$$.fragment);
    			t6 = space();
    			create_component(testimonial.$$.fragment);
    			t7 = space();
    			create_component(blog.$$.fragment);
    			t8 = space();
    			create_component(contact.$$.fragment);
    			t9 = space();
    			create_component(footer.$$.fragment);
    			t10 = space();
    			create_component(switcher.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(homesection, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(client, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(aboutus, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(services, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(team, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(pricing, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(testimonial, target, anchor);
    			insert(target, t7, anchor);
    			mount_component(blog, target, anchor);
    			insert(target, t8, anchor);
    			mount_component(contact, target, anchor);
    			insert(target, t9, anchor);
    			mount_component(footer, target, anchor);
    			insert(target, t10, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(homesection.$$.fragment, local);
    			transition_in(client.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(homesection.$$.fragment, local);
    			transition_out(client.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			destroy_component(homesection, detaching);
    			if (detaching) detach(t1);
    			destroy_component(client, detaching);
    			if (detaching) detach(t2);
    			destroy_component(aboutus, detaching);
    			if (detaching) detach(t3);
    			destroy_component(services, detaching);
    			if (detaching) detach(t4);
    			destroy_component(team, detaching);
    			if (detaching) detach(t5);
    			destroy_component(pricing, detaching);
    			if (detaching) detach(t6);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach(t7);
    			destroy_component(blog, detaching);
    			if (detaching) detach(t8);
    			destroy_component(contact, detaching);
    			if (detaching) detach(t9);
    			destroy_component(footer, detaching);
    			if (detaching) detach(t10);
    			destroy_component(switcher, detaching);
    		}
    	};
    }

    class Layout_7 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$8, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout8/HomeSection.svelte generated by Svelte v3.50.1 */

    function create_default_slot_2$5(ctx) {
    	let h4;
    	let t1;
    	let h1;
    	let t3;
    	let p;
    	let t5;
    	let div;

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Awesome Design";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "We love make things amazing and simple";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Maecenas class semper class semper sollicitudin lectus lorem iaculis imperdiet aliquam\n\t\t\t\t\t\t\tvehicula tempor auctor curabitur pede aenean ornare.";
    			t5 = space();
    			div = element("div");
    			div.innerHTML = `<iframe title="frame-video" src="http://player.vimeo.com/video/69988283?color=f15b72&amp;title=0&amp;byline=0&amp;portrait=0" width="555" height="321" class="frame-border"></iframe>`;
    			attr(h4, "class", "home-small-title");
    			attr(h1, "class", "home-title");
    			attr(p, "class", "pt-3 home-desc mx-auto");
    			attr(div, "class", "mt-5");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, p, anchor);
    			insert(target, t5, anchor);
    			insert(target, div, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(p);
    			if (detaching) detach(t5);
    			if (detaching) detach(div);
    		}
    	};
    }

    // (17:4) <Row class="justify-content-center">
    function create_default_slot_1$5(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 8,
    				class: "text-white text-center",
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (16:3) <Container>
    function create_default_slot$5(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	let section;
    	let div0;
    	let t;
    	let div2;
    	let div1;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			div0 = element("div");
    			t = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(container.$$.fragment);
    			attr(div0, "class", "bg-overlay");
    			attr(div1, "class", "home-cell-bottom");
    			attr(div2, "class", "display-table");
    			attr(section, "class", "section section-lg home-half common-section");
    			attr(section, "id", "home");
    			set_style(section, "background-image", "url('images/img-2.jpg')");
    			set_style(section, "background-size", "cover");
    			set_style(section, "background-position", "center");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div0);
    			append(section, t);
    			append(section, div2);
    			append(div2, div1);
    			mount_component(container, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    class HomeSection$1 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$7, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout8/Layout_8.svelte generated by Svelte v3.50.1 */

    function create_fragment$6(ctx) {
    	let navbar;
    	let t0;
    	let homesection;
    	let t1;
    	let client;
    	let t2;
    	let aboutus;
    	let t3;
    	let services;
    	let t4;
    	let team;
    	let t5;
    	let pricing;
    	let t6;
    	let testimonial;
    	let t7;
    	let blog;
    	let t8;
    	let contact;
    	let t9;
    	let footer;
    	let t10;
    	let switcher;
    	let current;
    	navbar = new Navbar({ props: { extraclass: "" } });
    	homesection = new HomeSection$1({});
    	client = new Client({});
    	aboutus = new AboutUs({});

    	services = new Services({
    			props: {
    				serviceData: MOCK_DATA.SERVICE_DATA,
    				websiteData: MOCK_DATA.WEBSITE_DESCRIPTION
    			}
    		});

    	team = new Team({ props: { teamData: MOCK_DATA.TEAM_DATA } });

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA }
    		});

    	testimonial = new Testimonial({
    			props: {
    				testimonialData: MOCK_DATA.TESATIMONIAL_DATA,
    				startedData: MOCK_DATA.GET_STARTED
    			}
    		});

    	blog = new Blog({ props: { blogData: MOCK_DATA.BLOG_DATA } });
    	contact = new Contact({});
    	footer = new Footer({});
    	switcher = new Switcher({});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(homesection.$$.fragment);
    			t1 = space();
    			create_component(client.$$.fragment);
    			t2 = space();
    			create_component(aboutus.$$.fragment);
    			t3 = space();
    			create_component(services.$$.fragment);
    			t4 = space();
    			create_component(team.$$.fragment);
    			t5 = space();
    			create_component(pricing.$$.fragment);
    			t6 = space();
    			create_component(testimonial.$$.fragment);
    			t7 = space();
    			create_component(blog.$$.fragment);
    			t8 = space();
    			create_component(contact.$$.fragment);
    			t9 = space();
    			create_component(footer.$$.fragment);
    			t10 = space();
    			create_component(switcher.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(homesection, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(client, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(aboutus, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(services, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(team, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(pricing, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(testimonial, target, anchor);
    			insert(target, t7, anchor);
    			mount_component(blog, target, anchor);
    			insert(target, t8, anchor);
    			mount_component(contact, target, anchor);
    			insert(target, t9, anchor);
    			mount_component(footer, target, anchor);
    			insert(target, t10, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(homesection.$$.fragment, local);
    			transition_in(client.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(homesection.$$.fragment, local);
    			transition_out(client.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			destroy_component(homesection, detaching);
    			if (detaching) detach(t1);
    			destroy_component(client, detaching);
    			if (detaching) detach(t2);
    			destroy_component(aboutus, detaching);
    			if (detaching) detach(t3);
    			destroy_component(services, detaching);
    			if (detaching) detach(t4);
    			destroy_component(team, detaching);
    			if (detaching) detach(t5);
    			destroy_component(pricing, detaching);
    			if (detaching) detach(t6);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach(t7);
    			destroy_component(blog, detaching);
    			if (detaching) detach(t8);
    			destroy_component(contact, detaching);
    			if (detaching) detach(t9);
    			destroy_component(footer, detaching);
    			if (detaching) detach(t10);
    			destroy_component(switcher, detaching);
    		}
    	};
    }

    class Layout_8 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$6, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout9/HomeSection.svelte generated by Svelte v3.50.1 */

    function create_default_slot_4$4(ctx) {
    	let h4;
    	let t1;
    	let h1;
    	let t3;
    	let p0;
    	let t5;
    	let p1;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			h4 = element("h4");
    			h4.textContent = "Awesome Design";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "We love make things amazing and simple";
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "Maecenas class semper class semper sollicitudin lectus lorem iaculis\n          imperdiet aliquam vehicula tempor auctor curabitur pede aenean ornare.";
    			t5 = space();
    			p1 = element("p");
    			p1.innerHTML = `<a href="${"#"}" class="play-btn video-play-icon"><i class="mdi mdi-play text-center"></i></a>`;
    			attr(h4, "class", "home-small-title");
    			attr(h1, "class", "home-title");
    			attr(p0, "class", "pt-3 home-desc mx-auto");
    			attr(p1, "class", "play-shadow mt-4");
    		},
    		m(target, anchor) {
    			insert(target, h4, anchor);
    			insert(target, t1, anchor);
    			insert(target, h1, anchor);
    			insert(target, t3, anchor);
    			insert(target, p0, anchor);
    			insert(target, t5, anchor);
    			insert(target, p1, anchor);

    			if (!mounted) {
    				dispose = listen(p1, "click", /*toggle*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(h4);
    			if (detaching) detach(t1);
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(p0);
    			if (detaching) detach(t5);
    			if (detaching) detach(p1);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (27:4) <Row class="justify-content-center">
    function create_default_slot_3$4(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 8,
    				class: "text-white text-center",
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (26:2) <Container class="slidero">
    function create_default_slot_2$4(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    // (47:4) <ModalBody>
    function create_default_slot_1$4(ctx) {
    	let video;
    	let video_src_value;

    	return {
    		c() {
    			video = element("video");
    			video.innerHTML = `<track default="" kind="captions" type="video/mp4"/>`;
    			attr(video, "id", "VisaChipCardVideo");
    			attr(video, "class", "video-box");
    			if (!src_url_equal(video.src, video_src_value = "https://www.w3schools.com/html/mov_bbb.mp4")) attr(video, "src", video_src_value);
    			video.controls = true;
    		},
    		m(target, anchor) {
    			insert(target, video, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(video);
    		}
    	};
    }

    // (45:2) <Modal isOpen={open} size="lg" {toggle} class="home-modal">
    function create_default_slot$4(ctx) {
    	let modalheader;
    	let t;
    	let modalbody;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle: /*toggle*/ ctx[1],
    				class: "border-0"
    			}
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(modalheader.$$.fragment);
    			t = space();
    			create_component(modalbody.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert(target, t, anchor);
    			mount_component(modalbody, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const modalbody_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach(t);
    			destroy_component(modalbody, detaching);
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	let section;
    	let div;
    	let t0;
    	let container;
    	let t1;
    	let modal;
    	let current;

    	container = new Container({
    			props: {
    				class: "slidero",
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			}
    		});

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[0],
    				size: "lg",
    				toggle: /*toggle*/ ctx[1],
    				class: "home-modal",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			div = element("div");
    			t0 = space();
    			create_component(container.$$.fragment);
    			t1 = space();
    			create_component(modal.$$.fragment);
    			attr(div, "class", "bg-overlay");
    			attr(section, "class", "section bg-home vh-100 common-section");
    			attr(section, "id", "home");
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div);
    			append(section, t0);
    			mount_component(container, section, null);
    			append(section, t1);
    			mount_component(modal, section, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    			const modal_changes = {};
    			if (dirty & /*open*/ 1) modal_changes.isOpen = /*open*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(container);
    			destroy_component(modal);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let open = false;

    	/**
     * Toggle modal
     */
    	const toggle = () => {
    		$$invalidate(0, open = !open);
    	};

    	return [open, toggle];
    }

    class HomeSection extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, {});
    	}
    }

    /* src/routes/Layout9/Layout_9.svelte generated by Svelte v3.50.1 */

    function create_fragment$4(ctx) {
    	let navbar;
    	let t0;
    	let homesection;
    	let t1;
    	let client;
    	let t2;
    	let aboutus;
    	let t3;
    	let services;
    	let t4;
    	let team;
    	let t5;
    	let pricing;
    	let t6;
    	let testimonial;
    	let t7;
    	let blog;
    	let t8;
    	let contact;
    	let t9;
    	let footer;
    	let t10;
    	let switcher;
    	let current;
    	navbar = new Navbar({ props: { extraclass: "" } });
    	homesection = new HomeSection({});
    	client = new Client({});
    	aboutus = new AboutUs({});

    	services = new Services({
    			props: {
    				serviceData: MOCK_DATA.SERVICE_DATA,
    				websiteData: MOCK_DATA.WEBSITE_DESCRIPTION
    			}
    		});

    	team = new Team({ props: { teamData: MOCK_DATA.TEAM_DATA } });

    	pricing = new Pricing({
    			props: { pricingData: MOCK_DATA.PRICING_DATA }
    		});

    	testimonial = new Testimonial({
    			props: {
    				testimonialData: MOCK_DATA.TESATIMONIAL_DATA,
    				startedData: MOCK_DATA.GET_STARTED
    			}
    		});

    	blog = new Blog({ props: { blogData: MOCK_DATA.BLOG_DATA } });
    	contact = new Contact({});
    	footer = new Footer({});
    	switcher = new Switcher({});

    	return {
    		c() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(homesection.$$.fragment);
    			t1 = space();
    			create_component(client.$$.fragment);
    			t2 = space();
    			create_component(aboutus.$$.fragment);
    			t3 = space();
    			create_component(services.$$.fragment);
    			t4 = space();
    			create_component(team.$$.fragment);
    			t5 = space();
    			create_component(pricing.$$.fragment);
    			t6 = space();
    			create_component(testimonial.$$.fragment);
    			t7 = space();
    			create_component(blog.$$.fragment);
    			t8 = space();
    			create_component(contact.$$.fragment);
    			t9 = space();
    			create_component(footer.$$.fragment);
    			t10 = space();
    			create_component(switcher.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(homesection, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(client, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(aboutus, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(services, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(team, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(pricing, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(testimonial, target, anchor);
    			insert(target, t7, anchor);
    			mount_component(blog, target, anchor);
    			insert(target, t8, anchor);
    			mount_component(contact, target, anchor);
    			insert(target, t9, anchor);
    			mount_component(footer, target, anchor);
    			insert(target, t10, anchor);
    			mount_component(switcher, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(homesection.$$.fragment, local);
    			transition_in(client.$$.fragment, local);
    			transition_in(aboutus.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(team.$$.fragment, local);
    			transition_in(pricing.$$.fragment, local);
    			transition_in(testimonial.$$.fragment, local);
    			transition_in(blog.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(switcher.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(homesection.$$.fragment, local);
    			transition_out(client.$$.fragment, local);
    			transition_out(aboutus.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(team.$$.fragment, local);
    			transition_out(pricing.$$.fragment, local);
    			transition_out(testimonial.$$.fragment, local);
    			transition_out(blog.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(switcher.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach(t0);
    			destroy_component(homesection, detaching);
    			if (detaching) detach(t1);
    			destroy_component(client, detaching);
    			if (detaching) detach(t2);
    			destroy_component(aboutus, detaching);
    			if (detaching) detach(t3);
    			destroy_component(services, detaching);
    			if (detaching) detach(t4);
    			destroy_component(team, detaching);
    			if (detaching) detach(t5);
    			destroy_component(pricing, detaching);
    			if (detaching) detach(t6);
    			destroy_component(testimonial, detaching);
    			if (detaching) detach(t7);
    			destroy_component(blog, detaching);
    			if (detaching) detach(t8);
    			destroy_component(contact, detaching);
    			if (detaching) detach(t9);
    			destroy_component(footer, detaching);
    			if (detaching) detach(t10);
    			destroy_component(switcher, detaching);
    		}
    	};
    }

    class Layout_9 extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$4, safe_not_equal, {});
    	}
    }

    /* src/routes/login.svelte generated by Svelte v3.50.1 */

    function create_default_slot_12$2(ctx) {
    	let i;

    	return {
    		c() {
    			i = element("i");
    			attr(i, "class", "mdi mdi-home h1");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(i);
    		}
    	};
    }

    // (37:20) <Link                       to="/"                       class="text-dark text-uppercase account-pages-logo"                       >
    function create_default_slot_11$2(ctx) {
    	let i;
    	let t;

    	return {
    		c() {
    			i = element("i");
    			t = text("Hiric");
    			attr(i, "class", "mdi mdi-alien");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    			insert(target, t, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(i);
    			if (detaching) detach(t);
    		}
    	};
    }

    // (48:22) <Label for="username">
    function create_default_slot_10$2(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Username");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (47:20) <FormGroup>
    function create_default_slot_9$2(ctx) {
    	let label;
    	let t;
    	let input;
    	let current;

    	label = new Label({
    			props: {
    				for: "username",
    				$$slots: { default: [create_default_slot_10$2] },
    				$$scope: { ctx }
    			}
    		});

    	input = new Input({
    			props: {
    				type: "text",
    				class: "form-control",
    				id: "username",
    				placeholder: "Enter username"
    			}
    		});

    	return {
    		c() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(label, target, anchor);
    			insert(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const label_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach(t);
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (58:22) <Label for="userpassword">
    function create_default_slot_8$3(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Password");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (57:20) <FormGroup>
    function create_default_slot_7$3(ctx) {
    	let label;
    	let t;
    	let input;
    	let current;

    	label = new Label({
    			props: {
    				for: "userpassword",
    				$$slots: { default: [create_default_slot_8$3] },
    				$$scope: { ctx }
    			}
    		});

    	input = new Input({
    			props: {
    				type: "password",
    				class: "form-control",
    				id: "userpassword",
    				placeholder: "Enter password"
    			}
    		});

    	return {
    		c() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(label, target, anchor);
    			insert(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const label_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach(t);
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (74:22) <Label class="form-check-label" for="flexCheckDefault">
    function create_default_slot_6$3(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Remember me");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (80:22) <Button type="submit" color="primary">
    function create_default_slot_5$3(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Log In");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (84:22) <Link to="/password_forgot" class="text-dark"                         >
    function create_default_slot_4$3(ctx) {
    	let i;
    	let t;

    	return {
    		c() {
    			i = element("i");
    			t = text(" Forgot your password?");
    			attr(i, "class", "mdi mdi-lock");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    			insert(target, t, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(i);
    			if (detaching) detach(t);
    		}
    	};
    }

    // (46:18) <Form>
    function create_default_slot_3$3(ctx) {
    	let formgroup0;
    	let t0;
    	let formgroup1;
    	let t1;
    	let div0;
    	let input;
    	let t2;
    	let label;
    	let t3;
    	let div1;
    	let button;
    	let t4;
    	let div2;
    	let link;
    	let current;

    	formgroup0 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_9$2] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup1 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_7$3] },
    				$$scope: { ctx }
    			}
    		});

    	input = new Input({
    			props: {
    				class: "form-check-input",
    				type: "checkbox",
    				value: "",
    				id: "flexCheckDefault"
    			}
    		});

    	label = new Label({
    			props: {
    				class: "form-check-label",
    				for: "flexCheckDefault",
    				$$slots: { default: [create_default_slot_6$3] },
    				$$scope: { ctx }
    			}
    		});

    	button = new Button({
    			props: {
    				type: "submit",
    				color: "primary",
    				$$slots: { default: [create_default_slot_5$3] },
    				$$scope: { ctx }
    			}
    		});

    	link = new Link({
    			props: {
    				to: "/password_forgot",
    				class: "text-dark",
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(formgroup0.$$.fragment);
    			t0 = space();
    			create_component(formgroup1.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			create_component(input.$$.fragment);
    			t2 = space();
    			create_component(label.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			create_component(button.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			create_component(link.$$.fragment);
    			attr(div0, "class", "form-check");
    			attr(div1, "class", "d-grid mt-3");
    			attr(div2, "class", "mt-4 mb-0 text-center");
    		},
    		m(target, anchor) {
    			mount_component(formgroup0, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(formgroup1, target, anchor);
    			insert(target, t1, anchor);
    			insert(target, div0, anchor);
    			mount_component(input, div0, null);
    			append(div0, t2);
    			mount_component(label, div0, null);
    			insert(target, t3, anchor);
    			insert(target, div1, anchor);
    			mount_component(button, div1, null);
    			insert(target, t4, anchor);
    			insert(target, div2, anchor);
    			mount_component(link, div2, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formgroup0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup0_changes.$$scope = { dirty, ctx };
    			}

    			formgroup0.$set(formgroup0_changes);
    			const formgroup1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup1_changes.$$scope = { dirty, ctx };
    			}

    			formgroup1.$set(formgroup1_changes);
    			const label_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formgroup0.$$.fragment, local);
    			transition_in(formgroup1.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			transition_in(label.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formgroup0.$$.fragment, local);
    			transition_out(formgroup1.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			transition_out(label.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formgroup0, detaching);
    			if (detaching) detach(t0);
    			destroy_component(formgroup1, detaching);
    			if (detaching) detach(t1);
    			if (detaching) detach(div0);
    			destroy_component(input);
    			destroy_component(label);
    			if (detaching) detach(t3);
    			if (detaching) detach(div1);
    			destroy_component(button);
    			if (detaching) detach(t4);
    			if (detaching) detach(div2);
    			destroy_component(link);
    		}
    	};
    }

    // (32:10) <Col lg={5}>
    function create_default_slot_2$3(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let h3;
    	let link;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let form;
    	let current;

    	link = new Link({
    			props: {
    				to: "/",
    				class: "text-dark text-uppercase account-pages-logo",
    				$$slots: { default: [create_default_slot_11$2] },
    				$$scope: { ctx }
    			}
    		});

    	form = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			create_component(link.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Sign in to continue to Hiric.";
    			t2 = space();
    			div1 = element("div");
    			create_component(form.$$.fragment);
    			attr(h3, "class", "fw-bold");
    			attr(p, "class", "text-muted");
    			attr(div0, "class", "text-center mt-3");
    			attr(div1, "class", "p-4");
    			attr(div2, "class", "card-body");
    			attr(div3, "class", "card account-card");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div0);
    			append(div0, h3);
    			mount_component(link, h3, null);
    			append(div0, t0);
    			append(div0, p);
    			append(div2, t2);
    			append(div2, div1);
    			mount_component(form, div1, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const form_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div3);
    			destroy_component(link);
    			destroy_component(form);
    		}
    	};
    }

    // (31:8) <Row class="justify-content-center">
    function create_default_slot_1$3(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 5,
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (30:6) <Container>
    function create_default_slot$3(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let link;
    	let t;
    	let section;
    	let div2;
    	let div1;
    	let container;
    	let current;

    	link = new Link({
    			props: {
    				to: "/",
    				class: "text-white",
    				$$slots: { default: [create_default_slot_12$2] },
    				$$scope: { ctx }
    			}
    		});

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div0 = element("div");
    			create_component(link.$$.fragment);
    			t = space();
    			section = element("section");
    			div2 = element("div");
    			div1 = element("div");
    			create_component(container.$$.fragment);
    			attr(div0, "class", "account-home-btn d-none d-sm-block");
    			attr(div1, "class", "display-table-cell");
    			attr(div2, "class", "display-table");
    			attr(section, "class", "vh-100");
    		},
    		m(target, anchor) {
    			insert(target, div0, anchor);
    			mount_component(link, div0, null);
    			insert(target, t, anchor);
    			insert(target, section, anchor);
    			append(section, div2);
    			append(div2, div1);
    			mount_component(container, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div0);
    			destroy_component(link);
    			if (detaching) detach(t);
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$3($$self) {
    	onMount(() => {
    		var body = document.body;
    		body.classList.add("bg-account-pages");
    	});

    	return [];
    }

    class Login extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
    	}
    }

    /* src/routes/signup.svelte generated by Svelte v3.50.1 */

    function create_default_slot_12$1(ctx) {
    	let i;
    	let t;

    	return {
    		c() {
    			i = element("i");
    			t = text("Hiric");
    			attr(i, "class", "mdi mdi-alien");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    			insert(target, t, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(i);
    			if (detaching) detach(t);
    		}
    	};
    }

    // (47:22) <Label for="firstname">
    function create_default_slot_11$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("First Name");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (46:20) <FormGroup>
    function create_default_slot_10$1(ctx) {
    	let label;
    	let t;
    	let input;
    	let current;

    	label = new Label({
    			props: {
    				for: "firstname",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			}
    		});

    	input = new Input({
    			props: {
    				type: "text",
    				class: "form-control",
    				id: "firstname",
    				placeholder: "First Name"
    			}
    		});

    	return {
    		c() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(label, target, anchor);
    			insert(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const label_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach(t);
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (57:22) <Label for="email">
    function create_default_slot_9$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Email");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (56:20) <FormGroup>
    function create_default_slot_8$2(ctx) {
    	let label;
    	let t;
    	let input;
    	let current;

    	label = new Label({
    			props: {
    				for: "email",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			}
    		});

    	input = new Input({
    			props: {
    				type: "password",
    				class: "form-control",
    				id: "email",
    				placeholder: "Enter Email"
    			}
    		});

    	return {
    		c() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(label, target, anchor);
    			insert(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const label_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach(t);
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (67:22) <Label for="userpassword">
    function create_default_slot_7$2(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Password");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (66:20) <FormGroup>
    function create_default_slot_6$2(ctx) {
    	let label;
    	let t;
    	let input;
    	let current;

    	label = new Label({
    			props: {
    				for: "userpassword",
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			}
    		});

    	input = new Input({
    			props: {
    				type: "password",
    				class: "form-control",
    				id: "userpassword",
    				placeholder: "Enter password"
    			}
    		});

    	return {
    		c() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(label, target, anchor);
    			insert(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const label_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach(t);
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (83:22) <Label class="form-check-label" for="flexCheckDefault"                         >
    function create_default_slot_5$2(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Remember me");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (89:22) <Button type="submit" color="primary">
    function create_default_slot_4$2(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Sign in");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (45:18) <Form>
    function create_default_slot_3$2(ctx) {
    	let formgroup0;
    	let t0;
    	let formgroup1;
    	let t1;
    	let formgroup2;
    	let t2;
    	let div0;
    	let input;
    	let t3;
    	let label;
    	let t4;
    	let div1;
    	let button;
    	let t5;
    	let div2;
    	let current;

    	formgroup0 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup1 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_8$2] },
    				$$scope: { ctx }
    			}
    		});

    	formgroup2 = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			}
    		});

    	input = new Input({
    			props: {
    				class: "form-check-input",
    				type: "checkbox",
    				value: "",
    				id: "flexCheckDefault"
    			}
    		});

    	label = new Label({
    			props: {
    				class: "form-check-label",
    				for: "flexCheckDefault",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			}
    		});

    	button = new Button({
    			props: {
    				type: "submit",
    				color: "primary",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(formgroup0.$$.fragment);
    			t0 = space();
    			create_component(formgroup1.$$.fragment);
    			t1 = space();
    			create_component(formgroup2.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			create_component(input.$$.fragment);
    			t3 = space();
    			create_component(label.$$.fragment);
    			t4 = space();
    			div1 = element("div");
    			create_component(button.$$.fragment);
    			t5 = space();
    			div2 = element("div");
    			div2.innerHTML = `<p class="mb-0">Don&#39;t have an account ? <a href="login" class="text-danger">Sign in</a></p>`;
    			attr(div0, "class", "form-check");
    			attr(div1, "class", "d-grid mt-3");
    			attr(div2, "class", "mt-4 mb-0 text-center");
    		},
    		m(target, anchor) {
    			mount_component(formgroup0, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(formgroup1, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(formgroup2, target, anchor);
    			insert(target, t2, anchor);
    			insert(target, div0, anchor);
    			mount_component(input, div0, null);
    			append(div0, t3);
    			mount_component(label, div0, null);
    			insert(target, t4, anchor);
    			insert(target, div1, anchor);
    			mount_component(button, div1, null);
    			insert(target, t5, anchor);
    			insert(target, div2, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formgroup0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup0_changes.$$scope = { dirty, ctx };
    			}

    			formgroup0.$set(formgroup0_changes);
    			const formgroup1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup1_changes.$$scope = { dirty, ctx };
    			}

    			formgroup1.$set(formgroup1_changes);
    			const formgroup2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup2_changes.$$scope = { dirty, ctx };
    			}

    			formgroup2.$set(formgroup2_changes);
    			const label_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formgroup0.$$.fragment, local);
    			transition_in(formgroup1.$$.fragment, local);
    			transition_in(formgroup2.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			transition_in(label.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formgroup0.$$.fragment, local);
    			transition_out(formgroup1.$$.fragment, local);
    			transition_out(formgroup2.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			transition_out(label.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formgroup0, detaching);
    			if (detaching) detach(t0);
    			destroy_component(formgroup1, detaching);
    			if (detaching) detach(t1);
    			destroy_component(formgroup2, detaching);
    			if (detaching) detach(t2);
    			if (detaching) detach(div0);
    			destroy_component(input);
    			destroy_component(label);
    			if (detaching) detach(t4);
    			if (detaching) detach(div1);
    			destroy_component(button);
    			if (detaching) detach(t5);
    			if (detaching) detach(div2);
    		}
    	};
    }

    // (31:10) <Col lg={5}>
    function create_default_slot_2$2(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let h3;
    	let link;
    	let t0;
    	let p;
    	let t2;
    	let div1;
    	let form;
    	let current;

    	link = new Link({
    			props: {
    				to: "/",
    				class: "text-dark text-uppercase account-pages-logo",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			}
    		});

    	form = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			create_component(link.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Sign up for a new Account";
    			t2 = space();
    			div1 = element("div");
    			create_component(form.$$.fragment);
    			attr(h3, "class", "fw-bold");
    			attr(p, "class", "text-muted");
    			attr(div0, "class", "text-center mt-3");
    			attr(div1, "class", "p-4");
    			attr(div2, "class", "card-body");
    			attr(div3, "class", "card account-card");
    		},
    		m(target, anchor) {
    			insert(target, div3, anchor);
    			append(div3, div2);
    			append(div2, div0);
    			append(div0, h3);
    			mount_component(link, h3, null);
    			append(div0, t0);
    			append(div0, p);
    			append(div2, t2);
    			append(div2, div1);
    			mount_component(form, div1, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const form_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div3);
    			destroy_component(link);
    			destroy_component(form);
    		}
    	};
    }

    // (30:8) <Row class="justify-content-center">
    function create_default_slot_1$2(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 5,
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (29:6) <Container>
    function create_default_slot$2(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let t;
    	let section;
    	let div2;
    	let div1;
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div0 = element("div");
    			div0.innerHTML = `<a href="/" class="text-white"><i class="mdi mdi-home h1"></i></a>`;
    			t = space();
    			section = element("section");
    			div2 = element("div");
    			div1 = element("div");
    			create_component(container.$$.fragment);
    			attr(div0, "class", "account-home-btn d-none d-sm-block");
    			attr(div1, "class", "display-table-cell");
    			attr(div2, "class", "display-table");
    			attr(section, "class", "vh-100");
    		},
    		m(target, anchor) {
    			insert(target, div0, anchor);
    			insert(target, t, anchor);
    			insert(target, section, anchor);
    			append(section, div2);
    			append(div2, div1);
    			mount_component(container, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div0);
    			if (detaching) detach(t);
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$2($$self) {
    	onMount(() => {
    		var body = document.body;
    		body.classList.add("bg-account-pages");
    	});

    	return [];
    }

    class Signup extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
    	}
    }

    /* src/routes/password_forgot.svelte generated by Svelte v3.50.1 */

    function create_default_slot_8$1(ctx) {
    	let i;

    	return {
    		c() {
    			i = element("i");
    			attr(i, "class", "mdi mdi-home h1");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(i);
    		}
    	};
    }

    // (36:20) <Link                       to="/"                       class="text-dark text-uppercase account-pages-logo"                       >
    function create_default_slot_7$1(ctx) {
    	let i;
    	let t;

    	return {
    		c() {
    			i = element("i");
    			t = text("Hiric");
    			attr(i, "class", "mdi mdi-alien");
    		},
    		m(target, anchor) {
    			insert(target, i, anchor);
    			insert(target, t, anchor);
    		},
    		p: noop$1,
    		d(detaching) {
    			if (detaching) detach(i);
    			if (detaching) detach(t);
    		}
    	};
    }

    // (51:22) <Label for="email">
    function create_default_slot_6$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Email");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (50:20) <FormGroup>
    function create_default_slot_5$1(ctx) {
    	let label;
    	let t;
    	let input;
    	let current;

    	label = new Label({
    			props: {
    				for: "email",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			}
    		});

    	input = new Input({
    			props: {
    				type: "password",
    				class: "form-control",
    				id: "email",
    				placeholder: "Enter Email"
    			}
    		});

    	return {
    		c() {
    			create_component(label.$$.fragment);
    			t = space();
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(label, target, anchor);
    			insert(target, t, anchor);
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const label_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				label_changes.$$scope = { dirty, ctx };
    			}

    			label.$set(label_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(label.$$.fragment, local);
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(label, detaching);
    			if (detaching) detach(t);
    			destroy_component(input, detaching);
    		}
    	};
    }

    // (61:22) <Button type="submit" color="primary"                         >
    function create_default_slot_4$1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Reset your Password");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (49:18) <Form>
    function create_default_slot_3$1(ctx) {
    	let formgroup;
    	let t;
    	let div;
    	let button;
    	let current;

    	formgroup = new FormGroup({
    			props: {
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			}
    		});

    	button = new Button({
    			props: {
    				type: "submit",
    				color: "primary",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(formgroup.$$.fragment);
    			t = space();
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr(div, "class", "d-grid mt-3");
    		},
    		m(target, anchor) {
    			mount_component(formgroup, target, anchor);
    			insert(target, t, anchor);
    			insert(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const formgroup_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				formgroup_changes.$$scope = { dirty, ctx };
    			}

    			formgroup.$set(formgroup_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(formgroup.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(formgroup.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(formgroup, detaching);
    			if (detaching) detach(t);
    			if (detaching) detach(div);
    			destroy_component(button);
    		}
    	};
    }

    // (31:10) <Col lg={5}>
    function create_default_slot_2$1(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let h3;
    	let link;
    	let t0;
    	let p;
    	let t2;
    	let div2;
    	let div1;
    	let t4;
    	let form;
    	let current;

    	link = new Link({
    			props: {
    				to: "/",
    				class: "text-dark text-uppercase account-pages-logo",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			}
    		});

    	form = new Form({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			create_component(link.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Reset Password";
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "Enter your email address and we'll send you an email with\n                    instructions to reset your password.";
    			t4 = space();
    			create_component(form.$$.fragment);
    			attr(h3, "class", "fw-bold");
    			attr(p, "class", "text-muted");
    			attr(div0, "class", "text-center mt-3");
    			attr(div1, "class", "alert alert-warning text-center");
    			attr(div1, "role", "alert");
    			attr(div2, "class", "p-4");
    			attr(div3, "class", "card-body");
    			attr(div4, "class", "card account-card");
    		},
    		m(target, anchor) {
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, div0);
    			append(div0, h3);
    			mount_component(link, h3, null);
    			append(div0, t0);
    			append(div0, p);
    			append(div3, t2);
    			append(div3, div2);
    			append(div2, div1);
    			append(div2, t4);
    			mount_component(form, div2, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const form_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				form_changes.$$scope = { dirty, ctx };
    			}

    			form.$set(form_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div4);
    			destroy_component(link);
    			destroy_component(form);
    		}
    	};
    }

    // (30:8) <Row class="justify-content-center">
    function create_default_slot_1$1(ctx) {
    	let col;
    	let current;

    	col = new Col({
    			props: {
    				lg: 5,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(col.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(col, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const col_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				col_changes.$$scope = { dirty, ctx };
    			}

    			col.$set(col_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(col.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(col.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(col, detaching);
    		}
    	};
    }

    // (29:6) <Container>
    function create_default_slot$1(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				class: "justify-content-center",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(row.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(row, detaching);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let div0;
    	let link;
    	let t;
    	let section;
    	let div2;
    	let div1;
    	let container;
    	let current;

    	link = new Link({
    			props: {
    				to: "/",
    				class: "text-white",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			}
    		});

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div0 = element("div");
    			create_component(link.$$.fragment);
    			t = space();
    			section = element("section");
    			div2 = element("div");
    			div1 = element("div");
    			create_component(container.$$.fragment);
    			attr(div0, "class", "account-home-btn d-none d-sm-block");
    			attr(div1, "class", "display-table-cell");
    			attr(div2, "class", "display-table");
    			attr(section, "class", "vh-100");
    		},
    		m(target, anchor) {
    			insert(target, div0, anchor);
    			mount_component(link, div0, null);
    			insert(target, t, anchor);
    			insert(target, section, anchor);
    			append(section, div2);
    			append(div2, div1);
    			mount_component(container, div1, null);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div0);
    			destroy_component(link);
    			if (detaching) detach(t);
    			if (detaching) detach(section);
    			destroy_component(container);
    		}
    	};
    }

    function instance$1($$self) {
    	onMount(() => {
    		var body = document.body;
    		body.classList.add("bg-account-pages");
    	});

    	return [];
    }

    class Password_forgot extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
    	}
    }

    /* src/App.svelte generated by Svelte v3.50.1 */

    function create_default_slot_12(ctx) {
    	let layout1;
    	let current;
    	layout1 = new Layout_1({});

    	return {
    		c() {
    			create_component(layout1.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(layout1, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(layout1.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(layout1.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(layout1, detaching);
    		}
    	};
    }

    // (30:4) <Route path="/layout2">
    function create_default_slot_11(ctx) {
    	let layout2;
    	let current;
    	layout2 = new Layout_2({});

    	return {
    		c() {
    			create_component(layout2.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(layout2, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(layout2.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(layout2.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(layout2, detaching);
    		}
    	};
    }

    // (31:4) <Route path="/layout3">
    function create_default_slot_10(ctx) {
    	let layout3;
    	let current;
    	layout3 = new Layout_3({});

    	return {
    		c() {
    			create_component(layout3.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(layout3, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(layout3.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(layout3.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(layout3, detaching);
    		}
    	};
    }

    // (32:4) <Route path="/layout4">
    function create_default_slot_9(ctx) {
    	let layout4;
    	let current;
    	layout4 = new Layout_4({});

    	return {
    		c() {
    			create_component(layout4.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(layout4, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(layout4.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(layout4.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(layout4, detaching);
    		}
    	};
    }

    // (33:4) <Route path="/layout5">
    function create_default_slot_8(ctx) {
    	let layout5;
    	let current;
    	layout5 = new Layout_5({});

    	return {
    		c() {
    			create_component(layout5.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(layout5, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(layout5.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(layout5.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(layout5, detaching);
    		}
    	};
    }

    // (34:4) <Route path="/layout6">
    function create_default_slot_7(ctx) {
    	let layout6;
    	let current;
    	layout6 = new Layout_6({});

    	return {
    		c() {
    			create_component(layout6.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(layout6, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(layout6.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(layout6.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(layout6, detaching);
    		}
    	};
    }

    // (35:4) <Route path="/layout7">
    function create_default_slot_6(ctx) {
    	let layout7;
    	let current;
    	layout7 = new Layout_7({});

    	return {
    		c() {
    			create_component(layout7.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(layout7, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(layout7.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(layout7.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(layout7, detaching);
    		}
    	};
    }

    // (36:4) <Route path="/layout8">
    function create_default_slot_5(ctx) {
    	let layout8;
    	let current;
    	layout8 = new Layout_8({});

    	return {
    		c() {
    			create_component(layout8.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(layout8, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(layout8.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(layout8.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(layout8, detaching);
    		}
    	};
    }

    // (37:4) <Route path="/layout9">
    function create_default_slot_4(ctx) {
    	let layout9;
    	let current;
    	layout9 = new Layout_9({});

    	return {
    		c() {
    			create_component(layout9.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(layout9, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(layout9.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(layout9.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(layout9, detaching);
    		}
    	};
    }

    // (38:4) <Route path="/login">
    function create_default_slot_3(ctx) {
    	let login;
    	let current;
    	login = new Login({});

    	return {
    		c() {
    			create_component(login.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(login, detaching);
    		}
    	};
    }

    // (39:4) <Route path="/signup">
    function create_default_slot_2(ctx) {
    	let signup;
    	let current;
    	signup = new Signup({});

    	return {
    		c() {
    			create_component(signup.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(signup, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(signup.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(signup.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(signup, detaching);
    		}
    	};
    }

    // (40:4) <Route path="/password_forgot">
    function create_default_slot_1(ctx) {
    	let password_forgot;
    	let current;
    	password_forgot = new Password_forgot({});

    	return {
    		c() {
    			create_component(password_forgot.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(password_forgot, target, anchor);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(password_forgot.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(password_forgot.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(password_forgot, detaching);
    		}
    	};
    }

    // (27:0) <Router {url}>
    function create_default_slot(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let t4;
    	let route5;
    	let t5;
    	let route6;
    	let t6;
    	let route7;
    	let t7;
    	let route8;
    	let t8;
    	let route9;
    	let t9;
    	let route10;
    	let t10;
    	let route11;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			}
    		});

    	route1 = new Route({
    			props: {
    				path: "/layout2",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			}
    		});

    	route2 = new Route({
    			props: {
    				path: "/layout3",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			}
    		});

    	route3 = new Route({
    			props: {
    				path: "/layout4",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			}
    		});

    	route4 = new Route({
    			props: {
    				path: "/layout5",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			}
    		});

    	route5 = new Route({
    			props: {
    				path: "/layout6",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			}
    		});

    	route6 = new Route({
    			props: {
    				path: "/layout7",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			}
    		});

    	route7 = new Route({
    			props: {
    				path: "/layout8",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			}
    		});

    	route8 = new Route({
    			props: {
    				path: "/layout9",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			}
    		});

    	route9 = new Route({
    			props: {
    				path: "/login",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			}
    		});

    	route10 = new Route({
    			props: {
    				path: "/signup",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			}
    		});

    	route11 = new Route({
    			props: {
    				path: "/password_forgot",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    			t4 = space();
    			create_component(route5.$$.fragment);
    			t5 = space();
    			create_component(route6.$$.fragment);
    			t6 = space();
    			create_component(route7.$$.fragment);
    			t7 = space();
    			create_component(route8.$$.fragment);
    			t8 = space();
    			create_component(route9.$$.fragment);
    			t9 = space();
    			create_component(route10.$$.fragment);
    			t10 = space();
    			create_component(route11.$$.fragment);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(route0, div, null);
    			append(div, t0);
    			mount_component(route1, div, null);
    			append(div, t1);
    			mount_component(route2, div, null);
    			append(div, t2);
    			mount_component(route3, div, null);
    			append(div, t3);
    			mount_component(route4, div, null);
    			append(div, t4);
    			mount_component(route5, div, null);
    			append(div, t5);
    			mount_component(route6, div, null);
    			append(div, t6);
    			mount_component(route7, div, null);
    			append(div, t7);
    			mount_component(route8, div, null);
    			append(div, t8);
    			mount_component(route9, div, null);
    			append(div, t9);
    			mount_component(route10, div, null);
    			append(div, t10);
    			mount_component(route11, div, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route7_changes.$$scope = { dirty, ctx };
    			}

    			route7.$set(route7_changes);
    			const route8_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route8_changes.$$scope = { dirty, ctx };
    			}

    			route8.$set(route8_changes);
    			const route9_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route9_changes.$$scope = { dirty, ctx };
    			}

    			route9.$set(route9_changes);
    			const route10_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route10_changes.$$scope = { dirty, ctx };
    			}

    			route10.$set(route10_changes);
    			const route11_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route11_changes.$$scope = { dirty, ctx };
    			}

    			route11.$set(route11_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			transition_in(route9.$$.fragment, local);
    			transition_in(route10.$$.fragment, local);
    			transition_in(route11.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			transition_out(route9.$$.fragment, local);
    			transition_out(route10.$$.fragment, local);
    			transition_out(route11.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    			destroy_component(route7);
    			destroy_component(route8);
    			destroy_component(route9);
    			destroy_component(route10);
    			destroy_component(route11);
    		}
    	};
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(router.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(router, detaching);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { url = "" } = $$props;

    	onMount(() => {
    		var body = document.body;
    		body.classList.remove("bg-account-pages");
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	return [url];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0 });
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
