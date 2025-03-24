export const compareNumbers = async (args: { number1: number; number2: number }) => {
    try {
        // 入力値の型チェック
        if (typeof args.number1 !== 'number' || typeof args.number2 !== 'number') {
            throw new Error('Both inputs must be numbers');
        }

        const largerNumber = Math.max(args.number1, args.number2);

        return {
            content: [{
                type: 'text' as const,
                text: `The larger number is: ${largerNumber}`,
            }],
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error in comparison: ${error.message}`);
        } else {
            console.error(`Unknown error: ${error}`);
        }
        return {
            content: [{
                type: 'text' as const,
                text: `Error comparing numbers: ${error}`,
            }],
        };
    }
};
