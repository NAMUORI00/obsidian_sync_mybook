## 덱(Deque)

Double- ended queue의 줄임말로 큐의 전단(front)과 후단(rear)에서 모두 삽입과 삭제가 가능한 큐

![](assets/images/img-42.png)

덱의 구조 이미지, 전단, 후단에서 삭제,추가등의 수정이 가능하다.

![](assets/images/img-43.png)

덱(Deque)의 추상 구조 정리

![](assets/images/img-44.png)

앞에서 받아서 뒤에서 가져오는 queue 구조가 될수도 있고, 앞에서 넣고 앞에서 가져가는 Stack의 구조 형태도 될 수 있다.

> 구조의 활용성은 높을거 같은데, 구현하기 복잡할거 같다..  
> 교수님 말씀으론 잘 사용하는 편이 아니니 이런 구조가 있다는것만 이해하자.

### 배열을 이용한 덱의 구현

![](assets/images/img-41.png)

이전시간에 했던 배열을 통한 원형큐를 참고하자.

### C로 구현하기

```
#include <stdio.h>
#include <stdlib.h>

#define MAX_QUEUE_SIZE 5
//Deque 구조체
typedef int element;
typedef struct {
    int front;
    int rear;
    element data[MAX_QUEUE_SIZE];
} DequeType;


//에러 메세지 출력
void error(const char* message) {
    fprintf(stderr, "%s\n", message);
    exit(1);
}

//초기화
void init_deque(DequeType* q) {
    q->front = q->rear = 0;
}


int is_empty(DequeType* q) {
    return (q->front == q->rear);
}

int is_full(DequeType* q) {
    return ((q->rear + 1) % MAX_QUEUE_SIZE == q->front);
}

// 원형 DEQUE 타입 출력 함수
void deque_print(DequeType* q) {
    printf("DEQUE(front=%d rear = %d) =", q->front, q->rear);
    if (!is_empty(q)) {
        int i = q->front;
        do {
            i = (i + 1) % (MAX_QUEUE_SIZE);
            printf("%d | ", q->data[i]);
            if (i == q->rear)
                break;
        } while (i != q->front);
    }
    printf("\n");
}


void add_rear(DequeType* q, element item) {
    if (is_full(q)) 
        error("큐가 포화 상태입니다.");
    q->rear = (q->rear + 1) % MAX_QUEUE_SIZE;
    q->data[q->rear] = item;
}

element delete_front(DequeType* q) {
    if (is_empty(q)) 
        error("큐가 공백상태입니다");
    q->front = (q->front + 1) % MAX_QUEUE_SIZE;
    return q->data[q->front];
}

element get_front(DequeType* q) {
    if (is_empty(q))
        error("큐가 공백 상태입니다");
    return q->data[(q->front + 1) % MAX_QUEUE_SIZE];
}

void add_front(DequeType* q, element val) {
    if (is_full(q)) 
        error("큐가 포화 상태입니다.");
    q->data[q->front] = val;
    q->front = (q->front -1 + MAX_QUEUE_SIZE) % MAX_QUEUE_SIZE;
}

element delete_rear(DequeType* q) {
    int prev = q->rear;
    if (is_empty(q)) 
        error("큐가 공백상태입니다");
    q->rear = (q->rear - 1 + MAX_QUEUE_SIZE) % MAX_QUEUE_SIZE;
    return q->data[prev];
}


element get_rear(DequeType* q) {
    if (is_empty(q)) 
        error("큐가 공백상태입니다");
    return q->data[q->rear];
}

int main(void) {
    DequeType queue;

    init_deque(&queue);
    for (int i = 0; i < 3; i++) {
        add_front(&queue, i);
        deque_print(&queue);
    }

    for (int i = 0; i < 3; i++) {
        delete_rear(&queue);
        deque_print(&queue);
    }

    return 0;
}
```

> 이전 원형큐 구조에 약간의 변형과 앞쪽 뒤쪽 데이터를 제거, 추가, GET 하는 함수가 추가되었다.

### 큐의 응용 : 시뮬레이션

-   큐잉 모델은 고객에 대한 서비스를 수행하는 서버와 서비스를 받는 고객 들로 이루어진다
-   은행에 고객이 들어와서 서비스를 받고 나가는 과정을 시뮬레이션
    -   고객들이 기다리는 평균 시간을 계산

```
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define MAX_QUEUE_SIZE 5


//queue 구조체
typedef struct {
    int id;
    int arrival_time;
    int service_time;
} element;

typedef struct {
    int front;
    int rear;
    element data[MAX_QUEUE_SIZE];
} QueueType;


//에러 메세지 출력
void error(const char* message) {
    fprintf(stderr, "%s\n", message);
    exit(1);
}

//초기화
void init_queue(QueueType* q) {
    q->front = q->rear = 0;

}

int is_full(QueueType* q) {
    return ((q->rear + 1) % MAX_QUEUE_SIZE == q->front);
}

int is_empty(QueueType* q) {
    return (q->front == q->rear);
}

// 원형 QUEUE 타입 출력 함수
void queue_print(QueueType* q) {
    printf("QUEUE(front=%d rear = %d) =", q->front, q->rear);
    if (!is_empty(q)) {
        int i = q->front;
        do {
            i = (i + 1) % (MAX_QUEUE_SIZE);
            printf("%d | ", q->data[i]);
            if (i == q->rear)
                break;
        } while (i != q->front);
    }
    printf("\n");
}


void enqueue(QueueType* q, element item) {
    if (is_full(q)) {
        error("큐가 포화 상태입니다.");
    }
    q->rear = (q->rear + 1) % MAX_QUEUE_SIZE;
    q->data[q->rear] = item;
}

element dequeue(QueueType* q) {
    if (is_empty(q)) {
        error("큐가 공백상태입니다");
    }
    q->front = (q->front + 1) % MAX_QUEUE_SIZE;
    return q->data[q->front];
}

int main(void) {
    int minutes = 60;
    int total_wait = 0;
    int total_customers = 0;
    int service_time = 0;
    int service_customer;
    QueueType queue;

    init_queue(&queue);
    srand(time(NULL));
    for (int clock = 0; clock < minutes; clock++) {
        printf("현재시각 = %d\n", clock);
        if ((rand() % 10) < 3) {
            element customer;
            customer.id = total_customers++;
            customer.arrival_time = clock;
            customer.service_time = rand() % 3 + 1;
            enqueue(&queue, customer);
            printf("고객 %d이 %d분에 들어옵니다. 업무처리시간 = %d분 \n", customer.id, customer.arrival_time, customer.service_time);
        }
        if (service_time > 0) {
            printf("고객 %d 업무처리중입니다. \n", service_customer);
            service_time--;
        }
        else {
            if (!is_empty(&queue)) {
                element customer = dequeue(&queue);
                service_customer = customer.id;
                service_time = customer.service_time;
                printf("고객 %d이 %d분에 업무를 시작합니다. 대기시간은 %d분이었습니다. \n", customer.id, clock, clock - customer.arrival_time);
                total_wait += clock - customer.arrival_time;
            }
        }
    } // end of for

    printf("전체 대기사간 = %d분 \n", total_wait);
    return 0;
}
```

>  은행 시뮬레이션을 원형큐로 구현 했을때의 소스코드