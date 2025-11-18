fn main(x: u64, y: u64, result: pub u64) {
    assert(x + y == result);
}

#[test]
fn test_main() {
    main(5u64, 10u64, 15u64);
}

