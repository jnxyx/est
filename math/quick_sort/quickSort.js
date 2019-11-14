/******************************************************
 
 javascript 实现的快排算法


 事例：
 var array = [2,4,5,15,7,90,2]

 array = QuickSort(array)
 

 ******************************************************/

(function() {
    function QuickSort(array, lowIndex, highIndex) {
        if (array.constructor !== Array) {
            throw new Error('请传数组！')
        }

        let arrayLength = array.length

        let low = lowIndex || 0
        let high = highIndex || (arrayLength - 1)
        lowIndex = low
        highIndex = high
        let flag = array[low]
        let flagIndex = low
        low++
        let isFront = true

        while (low <= high) {
            if (isFront) {
                if (array[high] < flag) {
                    array[flagIndex] = array[high]
                    flagIndex = high
                    isFront = !isFront
                }
                high--
            } else {
                if (array[low] > flag) {
                    array[flagIndex] = array[low]
                    flagIndex = low
                    isFront = !isFront
                }
                low++
            }
        }
        array[flagIndex] = flag

        if (lowIndex < flagIndex - 1) {
            QuickSort(array, lowIndex, flagIndex - 1)
        }
        if (highIndex > flagIndex + 1) {
            QuickSort(array, flagIndex + 1, highIndex)
        }

        return array
    }

    window.QuickSort = QuickSort
})()