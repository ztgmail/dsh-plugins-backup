/** v1→v2 转换（占位实现：v2 尚不存在，仅结构骨架） */
export const V1_TO_V2 = {
    from: 1,
    to: 2,
    migrate(doc) {
        // TODO(schema-v2): 例如 settings 分区结构变更时在此改写；当前原样返回
        return doc;
    },
};
//# sourceMappingURL=v1-to-v2.js.map